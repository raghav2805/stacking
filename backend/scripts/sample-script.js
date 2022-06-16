async function main() {

  const _rewardToken = await hre.ethers.getContractFactory("rewardToken");
  const RewardToken = await _rewardToken.deploy();

  await RewardToken.deployed();

  console.log("RewardToken deployed to:", RewardToken.address);

  const stacking = await hre.ethers.getContractFactory("stacking");
  const Stacking = await stacking.deploy(RewardToken.address, RewardToken.address);

  await Stacking.deployed();

  console.log("Stacking deployed to:", Stacking.address);
}

const runMain = async () =>{
  try{
    await main();

    process.exit(0);
  }
  catch(err){
    console.error(err);
    process.exit(1);
  }
}

runMain();


// RewardToken deployed to: 0xe0B06011C635B288bC7A16dD4d3728486f40BD6D
// Stacking deployed to: 0x6E19dB321431E5F23A055153a1df13cE3d5Ab5ad