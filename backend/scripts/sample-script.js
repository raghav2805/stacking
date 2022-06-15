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


// RewardToken deployed to: 0x8671D2D717A3443356FdDaB27D8AAcEa0d355fD8
// Stacking deployed to: 0x43bC4A984166D223062e6B58541206dfe71Fc1eE