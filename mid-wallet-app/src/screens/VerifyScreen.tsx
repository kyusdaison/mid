import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useWalletStore } from '../store/walletStore';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  withSequence,
} from 'react-native-reanimated';

interface VerifiedCredential {
  issuer: string;
  type: string;
  holder: string;
  credentialId: string;
  issued: string;
  expiry: string;
  status: 'Valid Request' | 'Verified' | 'Active' | 'Expired' | 'Revoked' | 'Failed';
  registry?: string;
  requester?: string;
  purpose?: string;
  nonce?: string;
}

type VerifyFlowState =
  | 'SCANNING'
  | 'PROCESSING'
  | 'READY'
  | 'PRESENTING'
  | 'SUCCESS'
  | 'FAILURE'
  | 'EXPIRED'
  | 'OFFLINE';

type FailureReason =
  | 'INVALID_FORMAT'
  | 'UNREADABLE_QR'
  | 'OFFLINE'
  | 'EXPIRED_REQUEST'
  | 'DUPLICATE_SCAN'
  | 'UNABLE_TO_VERIFY'
  | 'CAMERA_PERMISSION_DENIED';

export default function VerifyScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const fcdid = useWalletStore((state) => state.fcdid);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [flowState, setFlowState] = useState<VerifyFlowState>('SCANNING');
  const [credential, setCredential] = useState<VerifiedCredential | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [failureReason, setFailureReason] = useState<FailureReason | null>(null);
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [scanHint, setScanHint] = useState('Align the QR code within the frame to verify an FCDID credential request.');
  const consentLoggedRef = useRef(false);
  const processingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const duplicateLockRef = useRef<string | null>(null);
  const lastScanRef = useRef<{ data: string; timestamp: number } | null>(null);

  const scanLinePos = useSharedValue(0);
  const scanLineOpacity = useSharedValue(1);
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(20);

  useEffect(() => {
    scanLinePos.value = withRepeat(
      withTiming(220, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    scanLineOpacity.value = withRepeat(
      withSequence(
        withTiming(0.45, { duration: 1250, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1250, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [scanLineOpacity, scanLinePos]);

  useEffect(() => {
    if (flowState === 'READY' || flowState === 'PRESENTING' || flowState === 'SUCCESS') {
      cardOpacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) });
      cardTranslateY.value = withTiming(0, { duration: 400, easing: Easing.out(Easing.ease) });
    } else {
      cardOpacity.value = 0;
      cardTranslateY.value = 20;
    }
  }, [flowState, cardOpacity, cardTranslateY]);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  useEffect(() => {
    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
    };
  }, []);

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLinePos.value }],
    opacity: scanLineOpacity.value,
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }],
  }));

  const sharedFields = useMemo(() => {
    if (!credential) return [];

    return [
      { label: 'Credential type', value: credential.type },
      { label: 'Credential ID', value: credential.credentialId },
      { label: 'Validity status', value: flowState === 'SUCCESS' ? 'Verified' : 'Valid Request' },
    ];
  }, [credential, flowState]);

  const detailFields = useMemo(() => {
    if (!credential) return [];

    return [
      { label: 'Issued', value: credential.issued },
      { label: 'Registry', value: credential.registry || 'Not provided' },
      { label: 'Requester', value: credential.requester || 'Not provided' },
      { label: 'Purpose', value: credential.purpose || 'Not provided' },
      { label: 'Proof type', value: 'FCDID credential request' },
      { label: 'Last checked', value: flowState === 'SUCCESS' ? 'Presented just now' : 'Validated just now' },
    ];
  }, [credential, flowState]);

  const getFailureCopy = (reason: FailureReason | null) => {
    switch (reason) {
      case 'CAMERA_PERMISSION_DENIED':
        return {
          state: 'FAILURE' as VerifyFlowState,
          badge: 'Camera Blocked',
          title: 'Camera Access Required',
          subtitle: 'Camera permission is needed to scan a credential request.',
          details: 'Allow camera access and try again.',
          guidance: 'Grant permission to continue scanning MID-compatible verification codes.',
          primary: 'Allow Camera',
          secondary: 'Back',
        };
      case 'UNREADABLE_QR':
        return {
          state: 'FAILURE' as VerifyFlowState,
          badge: 'Unreadable',
          title: 'QR Code Not Readable',
          subtitle: 'The QR code is partially visible or unreadable.',
          details: 'Make sure the full code is visible, steady, and well lit.',
          guidance: 'Try scanning again with the full QR code inside the frame.',
          primary: 'Scan Again',
          secondary: 'Back',
        };
      case 'OFFLINE':
        return {
          state: 'OFFLINE' as VerifyFlowState,
          badge: 'Offline',
          title: 'Verification Unavailable',
          subtitle: 'A network connection is required to verify this request.',
          details: 'Reconnect to the internet and try again.',
          guidance: 'MID Wallet could not complete verification while offline.',
          primary: 'Scan Again',
          secondary: 'Back',
        };
      case 'EXPIRED_REQUEST':
        return {
          state: 'EXPIRED' as VerifyFlowState,
          badge: 'Expired',
          title: 'Credential Expired',
          subtitle: 'This credential request has expired.',
          details: 'The verifier must provide a current request before presentation can continue.',
          guidance: 'Scan a valid, unexpired MID-compatible verification code.',
          primary: 'Scan Again',
          secondary: 'Back',
        };
      case 'DUPLICATE_SCAN':
        return {
          state: 'FAILURE' as VerifyFlowState,
          badge: 'Duplicate',
          title: 'Duplicate Scan Blocked',
          subtitle: 'This QR code was already scanned.',
          details: 'MID Wallet prevented the same request from being processed twice.',
          guidance: 'Use Scan Again to restart if you need to verify a new code.',
          primary: 'Scan Again',
          secondary: 'Back',
        };
      case 'INVALID_FORMAT':
        return {
          state: 'FAILURE' as VerifyFlowState,
          badge: 'Failed',
          title: 'Invalid Credential',
          subtitle: 'Not a recognized FCDID',
          details: 'Invalid Credential — Not a recognized FCDID',
          guidance: 'Try again with a valid MID-compatible verification code.',
          primary: 'Scan Again',
          secondary: 'Back',
        };
      case 'UNABLE_TO_VERIFY':
      default:
        return {
          state: 'FAILURE' as VerifyFlowState,
          badge: 'Failed',
          title: 'Verification Failed',
          subtitle: 'We could not verify this request.',
          details: 'The request could not be validated at this time.',
          guidance: 'Try again with a valid MID-compatible verification code.',
          primary: 'Scan Again',
          secondary: 'Back',
        };
    }
  };

  const setFailureState = (reason: FailureReason, message?: string) => {
    const failureCopy = getFailureCopy(reason);
    setCredential(null);
    setFailureReason(reason);
    setErrorMessage(message || failureCopy.details);
    setFlowState(failureCopy.state);
  };

  const parseCredentialFromQR = (data: string): VerifiedCredential | null => {
    if (!data.startsWith('fcid://')) {
      return null;
    }

    const payload = data.replace('fcid://', '').trim();

    if (!payload) {
      return null;
    }

    try {
      const decoded = decodeURIComponent(payload);
      const queryString = decoded.includes('?') ? decoded.split('?')[1] : decoded;
      const params = new URLSearchParams(queryString);

      const issuer = params.get('issuer');
      const type = params.get('type') || params.get('credentialType');
      const holder = params.get('holder') || params.get('holderName');
      const credentialId = params.get('id') || params.get('credentialId') || params.get('residencyId');
      const issued = params.get('issued');
      const expiry = params.get('expiry') || params.get('expires');
      const requester = params.get('requester') || params.get('verifier');
      const purpose = params.get('purpose');
      const registry = params.get('registry');
      const statusParam = params.get('status');
      const offlineParam = params.get('offline');
      const nonce = params.get('nonce');
      const service = params.get('service');

      if (offlineParam === 'true') {
        setFailureState('OFFLINE', 'A network connection is required to verify this request.');
        return null;
      }

      if (nonce && service) {
        return {
          issuer: service,
          type: 'Verification Request',
          holder: 'You',
          credentialId: nonce,
          issued: new Date().toISOString().split('T')[0],
          expiry: 'Valid for 5m',
          status: 'Valid Request',
          requester: service,
          purpose: params.get('requirements')?.replace(/,/g, ', ') || 'Identity verification',
          nonce: nonce,
        };
      }

      if (!issuer || !type || !holder || !credentialId || !expiry) {
        return null;
      }

      const normalizedStatus: VerifiedCredential['status'] =
        statusParam === 'Verified' ||
        statusParam === 'Active' ||
        statusParam === 'Expired' ||
        statusParam === 'Revoked' ||
        statusParam === 'Failed'
          ? statusParam
          : 'Valid Request';

      return {
        issuer,
        type,
        holder,
        credentialId,
        issued: issued || 'Not provided',
        expiry,
        status: normalizedStatus,
        registry: registry || undefined,
        requester: requester || 'MID-compatible verifier',
        purpose: purpose || 'Credential verification',
      };
    } catch {
      return null;
    }
  };

  const handleBarcodeScanned = ({ data }: { type: string; data: string }) => {
    if (flowState !== 'SCANNING') {
      return;
    }

    const normalized = data.trim();
    const now = Date.now();

    if (duplicateLockRef.current === normalized) {
      setFailureState('DUPLICATE_SCAN', 'This QR code was already scanned.');
      return;
    }

    if (lastScanRef.current && lastScanRef.current.data === normalized && now - lastScanRef.current.timestamp < 4000) {
      setFailureState('DUPLICATE_SCAN', 'This QR code was already scanned.');
      return;
    }

    duplicateLockRef.current = normalized;
    lastScanRef.current = { data: normalized, timestamp: now };
    setScannedData(normalized);
    setFailureReason(null);
    setErrorMessage('');
    setScanHint('Processing scanned request...');
    setFlowState('PROCESSING');

    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
    }

    processingTimeoutRef.current = setTimeout(() => {
      const parsedCredential = parseCredentialFromQR(normalized);

      if (!parsedCredential) {
        if (failureReason !== 'OFFLINE') {
          setFailureState(
            normalized.startsWith('fcid://') ? 'UNREADABLE_QR' : 'INVALID_FORMAT',
            normalized.startsWith('fcid://')
              ? 'The QR code is partially visible, unreadable, or incomplete.'
              : 'Invalid Credential — Not a recognized FCDID'
          );
        }
        return;
      }

      if (parsedCredential.status === 'Expired') {
        setFailureState('EXPIRED_REQUEST', 'This credential request has expired.');
        return;
      }

      if (parsedCredential.status === 'Failed' || parsedCredential.status === 'Revoked') {
        setFailureState('UNABLE_TO_VERIFY', 'We could not verify this request.');
        return;
      }

      setCredential(parsedCredential);
      setErrorMessage('');
      setFailureReason(null);
      setScanHint('Review the credential details before presentation.');
      setFlowState('READY');
    }, 900);
  };

  const resetToScan = () => {
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
    }
    setScannedData(null);
    setCredential(null);
    setErrorMessage('');
    setFailureReason(null);
    setShowFullDetails(false);
    setScanHint('Align the QR code within the frame to verify an FCDID credential request.');
    consentLoggedRef.current = false;
    duplicateLockRef.current = null;
    setFlowState('SCANNING');
  };

  const handleRequestCameraPermission = async () => {
    const result = await requestPermission();
    if (!result.granted) {
      setFailureState('CAMERA_PERMISSION_DENIED', 'Camera permission was denied.');
      return;
    }

    setFailureReason(null);
    setErrorMessage('');
    setFlowState('SCANNING');
  };

  const handlePresentCredential = () => {
    if (!credential) return;

    if (credential.status === 'Expired') {
      setFailureState('EXPIRED_REQUEST', 'This credential request has expired.');
      return;
    }

    if (credential.purpose?.toLowerCase().includes('offline')) {
      setFailureState('OFFLINE', 'A network connection is required to verify this request.');
      return;
    }

    consentLoggedRef.current = true;
    console.log('MID Wallet consent checkpoint', {
      timestamp: new Date().toISOString(),
      requester: credential.requester || 'MID-compatible verifier',
      purpose: credential.purpose || 'Credential verification',
      fieldsShared: sharedFields.map((field) => field.label),
    });

    setFlowState('PRESENTING');

    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
    }

    processingTimeoutRef.current = setTimeout(async () => {
      if (credential.nonce) {
        try {
          const response = await fetch(`http://localhost:3000/api/verify/${credential.nonce}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fcdid: fcdid,
              status: 'verified',
            }),
          });
          
          if (!response.ok) {
            console.error('Portal verification failed');
            setFailureState('UNABLE_TO_VERIFY', 'Portal rejected verification.');
            return;
          }
        } catch (error) {
          console.error('Portal fetch error:', error);
          setFailureState('OFFLINE', 'Could not reach portal.');
          return;
        }
      }
      setFlowState('SUCCESS');
    }, 900);
  };

  const renderHeader = (title: string, subtitle?: string) => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={24} color="#D7DCE5" />
      </TouchableOpacity>
      <View style={styles.headerTextWrap}>
        <Text style={styles.headerTitle}>{title}</Text>
        {!!subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.headerSpacer} />
    </View>
  );

  const renderFieldRows = (fields: Array<{ label: string; value: string }>) => (
    <BlurView intensity={24} tint="dark" style={styles.detailsBlock}>
      {fields.map((field, index) => (
        <View
          key={`${field.label}-${index}`}
          style={[styles.detailRow, index !== fields.length - 1 && styles.detailRowBorder]}
        >
          <Text style={styles.detailLabel}>{field.label}</Text>
          <Text style={styles.detailValue}>{field.value}</Text>
        </View>
      ))}
    </BlurView>
  );

  const renderStatusBadge = (label: string, tone: 'success' | 'neutral' | 'danger' | 'warning') => (
    <View
      style={[
        styles.statusBadge,
        tone === 'success' && styles.statusBadgeSuccess,
        tone === 'neutral' && styles.statusBadgeNeutral,
        tone === 'danger' && styles.statusBadgeDanger,
        tone === 'warning' && styles.statusBadgeWarning,
      ]}
    >
      <View
        style={[
          styles.statusBadgeDot,
          tone === 'success' && styles.statusBadgeDotSuccess,
          tone === 'neutral' && styles.statusBadgeDotNeutral,
          tone === 'danger' && styles.statusBadgeDotDanger,
          tone === 'warning' && styles.statusBadgeDotWarning,
        ]}
      />
      <Text style={styles.statusBadgeText}>{label}</Text>
    </View>
  );

  const renderCredentialCard = (currentCredential: VerifiedCredential, statusLabel: string) => (
    <Animated.View style={cardAnimatedStyle}>
      <BlurView intensity={34} tint="dark" style={styles.credentialCard}>
        <LinearGradient
          colors={['rgba(76,104,164,0.16)', 'rgba(14,20,32,0.08)', 'rgba(255,255,255,0.02)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />

        <View style={styles.cardChromeRow}>
          <View>
            <Text style={styles.cardEyebrow}>CREDENTIAL</Text>
            <Text style={styles.cardIssuerLabel}>Issuer</Text>
            <Text style={styles.cardIssuerValue}>{currentCredential.issuer}</Text>
          </View>
          {renderStatusBadge(
            statusLabel,
            flowState === 'SUCCESS' ? 'success' : flowState === 'PRESENTING' ? 'warning' : 'neutral'
          )}
        </View>

        <View style={styles.cardHeroBlock}>
          <Text style={styles.cardTypeLabel}>Type</Text>
          <Text style={styles.cardTypeValue}>{currentCredential.type}</Text>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.cardGrid}>
          <View style={styles.cardFieldBlock}>
            <Text style={styles.cardFieldLabel}>Holder</Text>
            <Text style={styles.cardFieldValue}>{currentCredential.holder}</Text>
          </View>
          <View style={styles.cardFieldBlock}>
            <Text style={styles.cardFieldLabel}>Expiry</Text>
            <Text style={styles.cardFieldValue}>{currentCredential.expiry}</Text>
          </View>
          <View style={styles.cardFieldBlockWide}>
            <Text style={styles.cardFieldLabel}>Status</Text>
            <Text style={styles.cardFieldValue}>{statusLabel}</Text>
          </View>
        </View>
      </BlurView>
    </Animated.View>
  );

  const renderReviewContent = (stateTitle: string, badge: string, description: string) => {
    if (!credential) return null;

    return (
      <>
        <View style={styles.statePanel}>
          <View style={styles.statePanelTopRow}>
            <Text style={styles.statePanelTitle}>{stateTitle}</Text>
            {renderStatusBadge(
              badge,
              flowState === 'SUCCESS' ? 'success' : flowState === 'PRESENTING' ? 'warning' : 'neutral'
            )}
          </View>
          <Text style={styles.statePanelDescription}>{description}</Text>
        </View>

        {renderCredentialCard(
          credential,
          flowState === 'SUCCESS' ? 'Verified' : flowState === 'PRESENTING' ? 'Presenting' : 'Valid Request'
        )}

        <Text style={styles.sectionTitle}>Verification Request</Text>
        <BlurView intensity={20} tint="dark" style={styles.requestCard}>
          <View style={styles.requestRow}>
            <Text style={styles.requestLabel}>Requester</Text>
            <Text style={styles.requestValue}>{credential.requester || 'MID-compatible verifier'}</Text>
          </View>
          <View style={[styles.requestRow, styles.detailRowBorder]}>
            <Text style={styles.requestLabel}>Purpose</Text>
            <Text style={styles.requestValue}>{credential.purpose || 'Credential verification'}</Text>
          </View>
          <Text style={styles.requestNotice}>
            This review is on-device only until you confirm sharing.
          </Text>
        </BlurView>

        <Text style={styles.sectionTitle}>Shared in this verification</Text>
        <View style={styles.summaryBlock}>
          <Text style={styles.summaryTextMuted}>
            Only the fields listed below will be shared if you continue.
          </Text>
          <Text style={styles.summaryTextSoft}>No other personal information will be sent before confirmation.</Text>
        </View>
        {renderFieldRows(sharedFields)}

        <TouchableOpacity
          style={styles.tertiaryButton}
          onPress={() => setShowFullDetails((current) => !current)}
        >
          <Text style={styles.tertiaryButtonText}>
            {showFullDetails ? 'Hide full details' : 'View full details'}
          </Text>
        </TouchableOpacity>

        {showFullDetails && (
          <>
            <Text style={styles.sectionTitle}>Full Details</Text>
            {renderFieldRows(detailFields)}
          </>
        )}
      </>
    );
  };

  const renderFailureScreen = () => {
    const failureCopy = getFailureCopy(failureReason);
    const isCameraFailure = failureReason === 'CAMERA_PERMISSION_DENIED';

    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <LinearGradient colors={['#14080C', '#070C16', '#02040A']} style={styles.gradientBackground} />
        {renderHeader(failureCopy.title, failureCopy.subtitle)}
        <View style={styles.resultContainer}>
          <View style={styles.statePanelFailure}>
            <View style={styles.statePanelTopRow}>
              <Text style={styles.statePanelTitle}>{failureCopy.title}</Text>
              {renderStatusBadge(
                failureCopy.badge,
                failureReason === 'EXPIRED_REQUEST' || failureReason === 'OFFLINE' || failureReason === 'CAMERA_PERMISSION_DENIED'
                  ? 'warning'
                  : 'danger'
              )}
            </View>
            <Text style={styles.statePanelDescription}>{failureCopy.subtitle}</Text>
          </View>

          {renderFieldRows([
            { label: 'Request status', value: failureCopy.badge },
            { label: 'Reason', value: errorMessage || failureCopy.details },
            { label: 'Guidance', value: failureCopy.guidance },
          ])}

          <View style={styles.footerActionsInline}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={isCameraFailure ? handleRequestCameraPermission : resetToScan}
            >
              <Text style={styles.primaryButtonText}>{failureCopy.primary}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
              <Text style={styles.secondaryButtonText}>{failureCopy.secondary}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (flowState === 'PROCESSING') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}> 
        <LinearGradient colors={['#040814', '#070C16', '#02040A']} style={styles.gradientBackground} />
        {renderHeader('Processing Request', 'Checking request integrity')}
        <View style={styles.centerState}>
          <View style={styles.processingOrb}>
            <ActivityIndicator size="small" color="#7FB3FF" />
          </View>
          <Text style={styles.processingTitle}>Processing Request</Text>
          <Text style={styles.processingText}>
            Please wait while MID Wallet validates the credential request.
          </Text>
        </View>
      </View>
    );
  }

  if (flowState === 'FAILURE' || flowState === 'EXPIRED' || flowState === 'OFFLINE') {
    return renderFailureScreen();
  }

  if (flowState === 'READY' && credential) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}> 
        <LinearGradient colors={['#06141A', '#070C16', '#02040A']} style={styles.gradientBackground} />
        {renderHeader('Credential Ready', 'Review the credential details before sharing.')}
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {renderReviewContent('Credential Ready', 'Valid Request', 'Review the credential details before sharing.')}
        </ScrollView>

        <View style={styles.footerActions}>
          <TouchableOpacity style={styles.primaryButton} onPress={handlePresentCredential}>
            <Text style={styles.primaryButtonText}>Share Credential</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={resetToScan}>
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (flowState === 'PRESENTING' && credential) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}> 
        <LinearGradient colors={['#07111A', '#070C16', '#02040A']} style={styles.gradientBackground} />
        {renderHeader('Sharing Credential', 'Preparing structured proof for verification.')}
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {renderReviewContent('Sharing Credential', 'Presenting', 'Preparing structured proof for verification.')}
        </ScrollView>

        <View style={styles.footerActions}>
          <TouchableOpacity style={[styles.primaryButton, styles.primaryButtonDisabled]} activeOpacity={1}>
            <ActivityIndicator size="small" color="#F7FAFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={resetToScan}>
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (flowState === 'SUCCESS' && credential) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}> 
        <LinearGradient colors={['#081A12', '#070C16', '#02040A']} style={styles.gradientBackground} />
        {renderHeader('Verification Complete', 'Credential matched and shared successfully.')}
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {renderReviewContent('Verification Complete', 'Verified', 'Credential matched and shared successfully.')}
        </ScrollView>

        <View style={styles.footerActions}>
          <TouchableOpacity style={styles.primaryButton} onPress={resetToScan}>
            <Text style={styles.primaryButtonText}>Scan Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.secondaryButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const permissionDenied = permission && !permission.granted && !permission.canAskAgain;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <LinearGradient colors={['#040814', '#080E1C', '#02040A']} style={styles.gradientBackground} />
      {renderHeader('Verify Credential', 'Scan a MID-compatible credential request')}

      <View style={styles.scannerWrapper}>
        <BlurView intensity={25} tint="dark" style={styles.scannerBox}>
          {permission?.granted ? (
            <CameraView
              style={StyleSheet.absoluteFillObject}
              facing="back"
              onBarcodeScanned={scannedData ? undefined : handleBarcodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ['qr'],
              }}
            />
          ) : (
            <View style={styles.cameraPlaceholder}>
              <Ionicons name="camera-outline" size={28} color="#738198" />
              <Text style={styles.placeholderText}>Camera access required</Text>
              {permissionDenied && (
                <TouchableOpacity style={styles.permissionButton} onPress={handleRequestCameraPermission}>
                  <Text style={styles.permissionButtonText}>Allow Camera</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {permission?.granted && <Animated.View style={[styles.scanLine, scanLineStyle]} />}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </BlurView>

        <Text style={styles.instructionText}>{scanHint}</Text>

        {!permission?.granted && (
          <View style={styles.permissionNotice}>
            <Text style={styles.permissionNoticeText}>
              Camera permission must be enabled before MID Wallet can scan a credential request.
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.manualFailureHint}
          onPress={() => setFailureState('UNREADABLE_QR', 'The QR code is partially visible or unreadable.')}
        >
          <Text style={styles.manualFailureHintText}>QR not scanning clearly?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#04060A',
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  headerTextWrap: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  headerTitle: {
    color: '#F4F7FB',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  headerSubtitle: {
    marginTop: 4,
    color: '#8E98A8',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 36,
  },
  scannerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  scannerBox: {
    width: 272,
    height: 272,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(122, 159, 255, 0.25)',
    backgroundColor: 'rgba(11, 16, 24, 0.45)',
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    left: 18,
    right: 18,
    height: 2,
    backgroundColor: '#7FB3FF',
    shadowColor: '#7FB3FF',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: '#8FB8FF',
  },
  topLeft: {
    top: 14,
    left: 14,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  topRight: {
    top: 14,
    right: 14,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  bottomLeft: {
    bottom: 14,
    left: 14,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  bottomRight: {
    bottom: 14,
    right: 14,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  instructionText: {
    marginTop: 24,
    color: '#A5B0C2',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  cameraPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  placeholderText: {
    color: '#D0D7E2',
    marginTop: 12,
    fontSize: 15,
    fontWeight: '600',
  },
  permissionButton: {
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(127,179,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(127,179,255,0.28)',
  },
  permissionButtonText: {
    color: '#EAF2FF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  permissionNotice: {
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  permissionNoticeText: {
    color: '#98A3B6',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  manualFailureHint: {
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  manualFailureHintText: {
    color: '#8EA3C8',
    fontSize: 13,
    fontWeight: '600',
  },
  centerState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  processingOrb: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(127,179,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(127,179,255,0.22)',
    marginBottom: 18,
  },
  processingTitle: {
    color: '#F2F5FA',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  processingText: {
    color: '#99A5B8',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 280,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 140,
  },
  statePanel: {
    padding: 18,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 16,
  },
  statePanelFailure: {
    padding: 18,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 18,
  },
  statePanelTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statePanelTitle: {
    flex: 1,
    color: '#F4F7FB',
    fontSize: 18,
    fontWeight: '700',
    paddingRight: 12,
  },
  statePanelDescription: {
    color: '#9AA5B6',
    fontSize: 14,
    lineHeight: 20,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusBadgeSuccess: {
    backgroundColor: 'rgba(52,199,89,0.12)',
    borderColor: 'rgba(52,199,89,0.28)',
  },
  statusBadgeNeutral: {
    backgroundColor: 'rgba(127,179,255,0.12)',
    borderColor: 'rgba(127,179,255,0.28)',
  },
  statusBadgeDanger: {
    backgroundColor: 'rgba(255,69,58,0.12)',
    borderColor: 'rgba(255,69,58,0.28)',
  },
  statusBadgeWarning: {
    backgroundColor: 'rgba(255,184,0,0.12)',
    borderColor: 'rgba(255,184,0,0.28)',
  },
  statusBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  statusBadgeDotSuccess: {
    backgroundColor: '#34C759',
  },
  statusBadgeDotNeutral: {
    backgroundColor: '#7FB3FF',
  },
  statusBadgeDotDanger: {
    backgroundColor: '#FF453A',
  },
  statusBadgeDotWarning: {
    backgroundColor: '#FFB800',
  },
  statusBadgeText: {
    color: '#EAF2FF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  credentialCard: {
    borderRadius: 22,
    padding: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(10,14,22,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(122, 159, 255, 0.18)',
    marginBottom: 18,
  },
  cardChromeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardEyebrow: {
    color: '#7EA6EE',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  cardIssuerLabel: {
    color: '#8E98A8',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardIssuerValue: {
    color: '#F6F8FC',
    fontSize: 16,
    fontWeight: '700',
    maxWidth: 220,
  },
  cardHeroBlock: {
    marginTop: 20,
  },
  cardTypeLabel: {
    color: '#8E98A8',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6,
  },
  cardTypeValue: {
    color: '#F4F7FB',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 18,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardFieldBlock: {
    width: '48%',
    marginBottom: 14,
  },
  cardFieldBlockWide: {
    width: '100%',
    marginBottom: 4,
  },
  cardFieldLabel: {
    color: '#8E98A8',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardFieldValue: {
    color: '#EEF2F8',
    fontSize: 15,
    fontWeight: '700',
  },
  sectionTitle: {
    color: '#EDF2F8',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  requestCard: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 18,
    overflow: 'hidden',
  },
  requestRow: {
    paddingVertical: 10,
  },
  requestLabel: {
    color: '#8E98A8',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  requestValue: {
    color: '#F0F4FA',
    fontSize: 15,
    fontWeight: '600',
  },
  requestNotice: {
    marginTop: 12,
    color: '#8DA0C1',
    fontSize: 12,
    lineHeight: 18,
  },
  summaryBlock: {
    marginBottom: 10,
  },
  summaryTextMuted: {
    color: '#C7D1E0',
    fontSize: 13,
    lineHeight: 19,
  },
  summaryTextSoft: {
    marginTop: 6,
    color: '#8494AF',
    fontSize: 12,
    lineHeight: 18,
  },
  detailsBlock: {
    borderRadius: 18,
    paddingHorizontal: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 14,
  },
  detailRow: {
    paddingVertical: 14,
  },
  detailRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  detailLabel: {
    color: '#8E98A8',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6,
  },
  detailValue: {
    color: '#F1F5FB',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  tertiaryButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 2,
    marginBottom: 14,
  },
  tertiaryButtonText: {
    color: '#8FB8FF',
    fontSize: 13,
    fontWeight: '700',
  },
  footerActions: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
    backgroundColor: 'rgba(4,6,10,0.92)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  footerActionsInline: {
    marginTop: 6,
  },
  primaryButton: {
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6DA6FF',
    marginBottom: 10,
  },
  primaryButtonDisabled: {
    opacity: 0.88,
  },
  primaryButtonText: {
    color: '#05101F',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  secondaryButtonText: {
    color: '#E4EAF4',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  resultContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
  },
});
