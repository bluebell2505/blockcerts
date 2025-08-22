const { ethers } = require("hardhat");

async function main() {
  const CertificateIssuer = await ethers.getContractFactory("CertificateIssuer");
  const contract = await CertificateIssuer.deploy();
  await contract.deployed();

  console.log("✅ CertificateIssuer deployed to:", contract.address);
}

main().catch((error) => { 
  console.error(error);
  process.exitCode = 1;
});
