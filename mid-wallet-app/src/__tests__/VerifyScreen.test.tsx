import React from 'react';
import { fireEvent, render, screen, waitFor, act } from '@testing-library/react-native';
import VerifyScreen from '../screens/VerifyScreen';

const goBackMock = jest.fn();
const requestPermissionMock = jest.fn();
const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

let mockPermission: { granted: boolean; canAskAgain: boolean } | null = {
  granted: true,
  canAskAgain: true,
};

let latestBarcodeHandler:
  | ((event: { type: string; data: string }) => void)
  | undefined;

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: goBackMock,
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('expo-blur', () => ({
  BlurView: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}));

jest.mock('react-native-reanimated', () => {
  const React = require('react');

  return {
    __esModule: true,
    default: {
      View: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
    },
    Easing: {
      ease: jest.fn(),
      inOut: jest.fn(() => jest.fn()),
      out: jest.fn(() => jest.fn()),
    },
    useSharedValue: jest.fn((value) => ({ value })),
    useAnimatedStyle: jest.fn((updater) => updater()),
    withRepeat: jest.fn((value) => value),
    withTiming: jest.fn((value) => value),
    withSequence: jest.fn((...values) => values[0]),
  };
});

jest.mock('expo-camera', () => {
  const React = require('react');
  const { View, Text } = require('react-native');

  return {
    CameraView: ({ onBarcodeScanned }: { onBarcodeScanned?: (event: { type: string; data: string }) => void }) => {
      latestBarcodeHandler = onBarcodeScanned;
      return (
        <View testID="camera-view">
          <Text>Mock Camera</Text>
        </View>
      );
    },
    useCameraPermissions: () => [mockPermission, requestPermissionMock],
  };
});

describe('VerifyScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    goBackMock.mockClear();
    requestPermissionMock.mockReset();
    requestPermissionMock.mockResolvedValue({ granted: true, canAskAgain: true });
    consoleLogSpy.mockClear();
    latestBarcodeHandler = undefined;
    mockPermission = {
      granted: true,
      canAskAgain: true,
    };
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  afterAll(() => {
    consoleLogSpy.mockRestore();
  });

  const renderScreen = () => render(<VerifyScreen />);

  const scanQr = async (data: string) => {
    renderScreen();

    expect(latestBarcodeHandler).toBeDefined();

    act(() => {
      latestBarcodeHandler?.({ type: 'qr', data });
    });

    expect(screen.getAllByText('Processing Request').length).toBeGreaterThan(0);

    act(() => {
      jest.advanceTimersByTime(900);
    });
  };

  it('renders the credential review card for a valid fcid:// scan', async () => {
    await scanQr(
      'fcid://verify?issuer=Montserrat%20Digital%20Residency&type=Digital%20Residency%20Credential&holder=Jane%20Citizen&credentialId=MSR-2026-00999&issued=17%20Mar%202026&expiry=17%20Mar%202029&status=Verified&requester=MID%20Verifier&purpose=Identity%20confirmation&registry=Montserrat%20Registry'
    );

    await waitFor(() => {
      expect(screen.getAllByText('Credential Ready').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Valid Request').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Review the credential details before presentation.').length).toBeGreaterThan(0);
      expect(screen.getByText('CREDENTIAL')).toBeTruthy();
      expect(screen.getByText('Issued by')).toBeTruthy();
      expect(screen.getByText('Montserrat Digital Residency')).toBeTruthy();
      expect(screen.getByText('Credential Type')).toBeTruthy();
      expect(screen.getByText('Digital Residency Credential')).toBeTruthy();
      expect(screen.getByText('Holder')).toBeTruthy();
      expect(screen.getByText('Jane Citizen')).toBeTruthy();
      expect(screen.getByText('Credential ID')).toBeTruthy();
      expect(screen.getByText('MSR-2026-00999')).toBeTruthy();
      expect(screen.getByText('Expires')).toBeTruthy();
      expect(screen.getByText('17 Mar 2029')).toBeTruthy();
      expect(screen.getByText('Status')).toBeTruthy();
      expect(screen.getByText('Shared in this verification')).toBeTruthy();
      expect(screen.getByText('Only the fields listed below will be shared if you continue.')).toBeTruthy();
      expect(screen.getByText('Present Credential')).toBeTruthy();
      expect(screen.getByText('Cancel')).toBeTruthy();
    });
  });

  it('renders a controlled failure state for an invalid QR code', async () => {
    await scanQr('not-a-valid-mid-credential');

    await waitFor(() => {
      expect(screen.getAllByText('Verification Failed').length).toBeGreaterThan(0);
      expect(screen.getByText('This QR code is not a valid credential request.')).toBeTruthy();
      expect(screen.getByText('Request status')).toBeTruthy();
      expect(screen.getByText('Failed')).toBeTruthy();
      expect(screen.getByText('Reason')).toBeTruthy();
      expect(screen.getByText('Guidance')).toBeTruthy();
      expect(screen.getByText('Try again with a valid MID-compatible verification code.')).toBeTruthy();
      expect(screen.getByText('Scan Again')).toBeTruthy();
      expect(screen.getByText('Back')).toBeTruthy();
    });
  });

  it('shows the camera permission denied UI and lets the user retry permission', async () => {
    mockPermission = {
      granted: false,
      canAskAgain: false,
    };

    requestPermissionMock.mockResolvedValue({ granted: false, canAskAgain: false });

    renderScreen();

    expect(screen.getByText('Verify Credential')).toBeTruthy();
    expect(screen.getByText('Camera access required')).toBeTruthy();
    expect(
      screen.getByText('Camera permission must be enabled before MID Wallet can scan a credential request.')
    ).toBeTruthy();
    expect(screen.getByText('Allow Camera')).toBeTruthy();
    expect(screen.queryByTestId('camera-view')).toBeNull();

    fireEvent.press(screen.getByText('Allow Camera'));

    await waitFor(() => {
      expect(requestPermissionMock).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText('Camera Access Required')).toBeTruthy();
      expect(screen.getByText('Camera permission is needed to scan a credential request.')).toBeTruthy();
      expect(screen.getByText('Camera permission was denied.')).toBeTruthy();
      expect(screen.getByText('Grant permission to continue scanning MID-compatible verification codes.')).toBeTruthy();
      expect(screen.getByText('Back')).toBeTruthy();
    });
  });

  it('handles an expired credential request gracefully', async () => {
    await scanQr(
      'fcid://verify?issuer=Montserrat%20Digital%20Residency&type=Digital%20Residency%20Credential&holder=Expired%20Holder&credentialId=MSR-2020-00001&issued=17%20Mar%202020&expiry=17%20Mar%202021&status=Expired&requester=MID%20Verifier&purpose=Identity%20confirmation'
    );

    await waitFor(() => {
      expect(screen.getAllByText('Credential Expired').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Expired').length).toBeGreaterThan(0);
      expect(screen.getByText('This credential request has expired.')).toBeTruthy();
      expect(screen.getByText('Scan a valid, unexpired MID-compatible verification code.')).toBeTruthy();
      expect(screen.getByText('Scan Again')).toBeTruthy();
      expect(screen.getByText('Back')).toBeTruthy();
    });
  });
});
