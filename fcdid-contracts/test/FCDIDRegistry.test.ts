import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";

describe("FCDIDRegistry", function () {
  let fcdidRegistry: any;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    // Deploying the contract
    const FCDIDRegistry = await ethers.getContractFactory("FCDIDRegistry");
    fcdidRegistry = await FCDIDRegistry.deploy(owner.address);
  });

  it("Should have correct premium pricing (1-3 chars)", async function () {
    expect(await fcdidRegistry.getPrice("fc")).to.equal(ethers.parseEther("3500"));
  });

  it("Should execute a successful commit & reveal registration", async function () {
    const domainName = "vitalik";
    const salt = ethers.encodeBytes32String("my-secret-salt");
    
    // 1. Commit
    const commitment = ethers.solidityPackedKeccak256(
      ["string", "address", "bytes32"],
      [domainName, addr1.address, salt]
    );
    
    await fcdidRegistry.connect(addr1).commit(commitment);
    
    // Attempting to register immediately should fail
    await expect(
      fcdidRegistry.connect(addr1).register(domainName, salt, 1, { value: ethers.parseEther("100") })
    ).to.be.revertedWith("Commitment too new, wait 1 minute");
    
    // 2. Fast forward time by 61 seconds
    await time.increase(61);
    
    // 3. Register (Reveal)
    // "vitalik" is 7 chars, so price should be 100 FCC/year. For 1 year -> 100 FCC.
    const registerTx = fcdidRegistry.connect(addr1).register(domainName, salt, 1, { value: ethers.parseEther("100") });
    await expect(registerTx)
      .to.emit(fcdidRegistry, "DomainRegistered")
      .withArgs(domainName, 1, addr1.address, anyValue);

    const receipt = await (await registerTx).wait();
    const block = await ethers.provider.getBlock(receipt!.blockNumber);
    const expectedExpiry = BigInt(block!.timestamp + 365 * 24 * 60 * 60);
      
    expect(await fcdidRegistry.ownerOf(1)).to.equal(addr1.address);
    expect(await fcdidRegistry.tokenIdToName(1)).to.equal(domainName);
    expect(await fcdidRegistry.tokenExpiry(1)).to.equal(expectedExpiry);
  });
  
  it("Should prevent front-running by matching msg.sender in commitment", async function () {
    const domainName = "frontrun";
    const salt = ethers.encodeBytes32String("salt");
    
    const commitment = ethers.solidityPackedKeccak256(
      ["string", "address", "bytes32"],
      [domainName, addr1.address, salt]
    );
    
    // Addr1 commits
    await fcdidRegistry.connect(addr1).commit(commitment);
    await time.increase(61);
    
    // Addr2 tries to register using Addr1's commitment data
    await expect(
      fcdidRegistry.connect(addr2).register(domainName, salt, 1, { value: ethers.parseEther("100") })
    ).to.be.revertedWith("No commitment found"); 
    // Fails because the server calculates: keccak256(domain, msg.sender (addr2), salt) 
    // which generates a totally different commitment hash.
  });
});
