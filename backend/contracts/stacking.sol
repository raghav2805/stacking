//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.11;

import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";

//stack
//withdraw
//earned

error NeedsMoreThanZero();
error transactionFail();

contract stacking is ReentrancyGuard{
    IERC20 public s_stakingToken;
    IERC20 public s_rewardsToken;

    uint private totalSupply;
    
    constructor(address stakingToken, address rewardsToken){
        s_stakingToken = IERC20(stakingToken);
        s_rewardsToken = IERC20(rewardsToken);
    }

    mapping(address => uint256) public s_balance;
    mapping(address => uint256) public s_rewards;
    mapping(address => uint256) public s_userRewardPerTokenPaid;

    uint256 public s_rewardPerTokenStored;
    uint256 public s_lastUpdated;
    uint256 public rewardRate = 100;

    modifier updateReward(address account){

        s_rewardPerTokenStored = rewardPerToken();
        s_lastUpdated = block.timestamp;
        s_rewards[account] = earned(account);
        s_userRewardPerTokenPaid[account] = s_rewardPerTokenStored;
        _;
    }

    function rewardPerToken() private view returns (uint){
        if(totalSupply == 0)
        {
            return s_rewardPerTokenStored;
        }

        return s_rewardPerTokenStored + (((block.timestamp - s_lastUpdated) * rewardRate*1e18)/ totalSupply);
    }

    function earned(address account) private view returns (uint){

        uint currentBalance = s_balance[account];
        uint amountPaid = s_userRewardPerTokenPaid[account];
        uint currentAmountPaid = rewardPerToken();

        uint pastReward = s_rewards[account];

        uint256 _earned = ((currentBalance * (currentAmountPaid - amountPaid)/1e18) + pastReward); 

        return _earned;
    }

    event Stacked(address sender,uint amount);
    event Withdrawn(address sender,uint amount);
    event Claimed(address sender,uint amount);


    modifier onlyAmount(uint amount){
        if(amount <= 0){
            revert NeedsMoreThanZero();
        }
        _;
    }

    function stack(uint amount) external onlyAmount(amount) nonReentrant updateReward(msg.sender){
        s_balance[msg.sender] += amount;
        totalSupply += amount;

        emit Stacked(msg.sender,amount);
        bool success = s_stakingToken.transferFrom(msg.sender , address(this), amount);

        if(!success){
            revert transactionFail();
        }

    }

    function withdraw(uint amount) external onlyAmount(amount) nonReentrant updateReward(msg.sender){
        require(s_balance[msg.sender] >= amount, "current balance is lass than amount claimed");

        s_balance[msg.sender] -= amount;
        totalSupply -= amount;

        emit Withdrawn(msg.sender,amount);
        bool success = s_stakingToken.transfer( msg.sender, amount);

        if(!success){
            revert transactionFail();
        }
    }

    function claimReward() external nonReentrant updateReward(msg.sender){
        uint claim = s_rewards[msg.sender];

        emit Claimed(msg.sender,claim);

        bool success = s_stakingToken.transfer(msg.sender, claim);

        if(!success){
            revert transactionFail();
        }
    }

    function getStaked(address account) public view returns (uint256) {
        return s_balance[account];
    }

}