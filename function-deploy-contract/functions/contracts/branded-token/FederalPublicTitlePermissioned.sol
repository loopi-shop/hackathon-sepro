// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/extensions/ERC4626.sol)

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "../trex/token/Token.sol";
import "hardhat/console.sol";

import {UD60x18, ud} from "@prb/math/src/UD60x18.sol";

/**
 */
contract FederalPublicTitlePermissioned is Context, Token {
    event Deposit(
        address indexed sender,
        address indexed owner,
        uint256 assets,
        uint256 shares
    );

    event Withdraw(
        address indexed sender,
        address indexed receiver,
        address indexed owner,
        uint256 assets,
        uint256 shares
    );

    using Math for uint256;

    IERC20 private immutable _asset;

    address[] private _holders;
    mapping(address => uint256) private _totalInvested;
    mapping(address => uint256) private _totalPlatformFees;

    uint256 private immutable _start;
    uint256 private immutable _duration;

    uint64 private _yield;

    uint256 private _totalAssets;
    uint256 private _maxAssets;

    uint256 DAYS_IN_A_YEAR = 365;

    UD60x18 DAYS_IN_A_YEAR_UD = ud(DAYS_IN_A_YEAR * 1e18);

    UD60x18 ONE_UD = ud(1e18);

    UD60x18 public nominalValue = ud(1000e18);
    UD60x18 private yieldUd;

    uint256 private BASE_18X6_DECIMALS_DIFF = 1e12;

    uint256 public IR_TAX_FEE = 2250;
    // uint256 public PLATFORM_FEE = 10;
    uint256 public PLATFORM_FEE = 0;

    UD60x18 private IR_TAX_FEE_UD = ud(IR_TAX_FEE * 1e14);
    UD60x18 private PLATFORM_FEE_UD = ud(PLATFORM_FEE * 1e14);

    /**
     * @dev Attempted to deposit more assets than the max amount for `receiver`.
     */
    error ERC4626ExceededMaxDeposit(
        address receiver,
        uint256 assets,
        uint256 max
    );

    /**
     * @dev Attempted to mint more shares than the max amount for `receiver`.
     */
    error ERC4626ExceededMaxMint(address receiver, uint256 shares, uint256 max);

    /**
     * @dev Attempted to withdraw more assets than the max amount for `receiver`.
     */
    error ERC4626ExceededMaxWithdraw(
        address owner,
        uint256 assets,
        uint256 max
    );

    /**
     * @dev Attempted to redeem more shares than the max amount for `receiver`.
     */
    error ERC4626ExceededMaxRedeem(address owner, uint256 shares, uint256 max);

    /**
     * @dev Set the underlying asset contract. This must be an ERC20-compatible contract (ERC20 or ERC777).
     */
    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 startTimestamp,
        uint256 durationDays,
        IERC20 asset_,
        uint64 yield_,
        uint256 maxAssets_,
        address _identityRegistry,
        address _compliance,
        address _onchainId
    )
    Token(
    _identityRegistry,
    _compliance,
    _name,
    _symbol,
    _decimals,
    _onchainId
    )
    {
        _asset = asset_;
        _start = startTimestamp;
        _duration = durationDays;
        _yield = yield_;
        yieldUd = ud(_yield * 1e10);
        _maxAssets = maxAssets_;
        // setNominalValue(_duration);
        addAgent(msg.sender);
    }

    /**
     * @dev Decimals are computed by adding the decimal offset on top of the underlying asset's decimals. This
     * "original" value is cached during construction of the vault contract. If this read operation fails (e.g., the
     * asset has not been created yet), a default of 18 is used to represent the underlying asset's decimals.
     *
     * See {IERC20Metadata-decimals}.
     */
    function decimals() public view virtual override returns (uint8) {
        return 6;
    }

    /** @dev See {IERC4626-asset}. */
    function asset() public view virtual returns (address) {
        return address(_asset);
    }

    /**
     * @dev Getter for the start timestamp.
     */
    function start() public view virtual returns (uint256) {
        return _start;
    }

    /**
     * @dev Getter for the vesting duration.
     */
    function duration() public view virtual returns (uint256) {
        return _duration;
    }

    /**
     * @dev Getter for the vesting duration.
     */
    function yield() public view virtual returns (uint64) {
        return _yield;
    }

    /** @dev See {IERC4626-totalAssets}. */
    function totalAssets() public view virtual returns (uint256) {
        return _totalAssets;
        //return _asset.balanceOf(address(this));
    }

    function holders() public view virtual returns (address[] memory) {
        return _holders;
    }

    function transfer(
        address to,
        uint256 amount
    ) public virtual override /*onlyAgent*/ returns (bool) {
        bool success = Token.transfer(to, amount);
        _addToHolders(to);
        return success;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override /*onlyAgent*/ returns (bool) {
        bool success = Token.transferFrom(from, to, amount);
        _addToHolders(to);
        return success;
    }

    /** @dev See {IERC4626-convertToShares}. */
    function convertToShares(
        uint256 assets,
        uint256 timestamp
    ) public view virtual returns (uint256) {
        return _convertToShares(assets, timestamp, Math.Rounding.Down);
    }

    /** @dev See {IERC4626-convertToAssets}. */
    function convertToAssets(
        uint256 shares,
        address receiver,
        uint256 timestamp
    ) public view virtual returns (uint256) {
        return
            _convertToAssets(
            shares,
            _totalInvested[receiver],
            timestamp,
            false,
            Math.Rounding.Down
        );
    }

    /** @dev See {IERC4626-maxDeposit}. */
    function maxDeposit(address) public view virtual returns (uint256) {
        return _maxAssets;
    }

    function maxAssets() public view virtual returns (uint256) {
        // return type(uint256).max;
        return _maxAssets;
    }

    function increaseMaxAssets(
        uint256 increase
    ) public virtual onlyAgent returns (uint256) {
        // return type(uint256).max;
        _maxAssets += increase;
        return _maxAssets;
    }

    function setYield(uint64 yield_) public virtual onlyAgent {
        _yield = yield_;
        yieldUd = ud(_yield * 1e10);
    }

    // /** @dev See {IERC4626-maxMint}. */
    // function maxMint(address) public view virtual returns (uint256) {
    //     // return type(uint256).max;
    //     return _maxMint;
    // }

    // function increaseMaxMint(uint256 increase) public virtual returns (uint256) {
    //     // return type(uint256).max;
    //     _maxMint += increase;
    //     return _maxMint;
    // }

    /** @dev See {IERC4626-maxWithdraw}. */
    function maxWithdraw(
        address owner,
        address receiver,
        uint256 timestamp
    ) public view virtual returns (uint256) {
        return
            _convertToAssets(
            balanceOf(owner),
            _totalInvested[receiver],
            timestamp,
            false,
            Math.Rounding.Down
        );
    }

    /** @dev See {IERC4626-maxRedeem}. */
    function maxRedeem(address owner) public view virtual returns (uint256) {
        return balanceOf(owner);
    }

    /** @dev See {IERC4626-previewDeposit}. */
    function previewDeposit(
        uint256 assets,
        uint256 timestamp
    ) public view virtual returns (uint256) {
        uint256 netAssets = getNetValueWithPlatformFee(assets);
        return _convertToShares(netAssets, timestamp, Math.Rounding.Down);
    }

    // /** @dev See {IERC4626-previewMint}. */
    // function previewMint(uint256 shares) public view virtual returns (uint256) {
    //     return _convertToAssets(shares, Math.Rounding.Up);
    // }

    /** @dev See {IERC4626-previewWithdraw}. */
    // function previewWithdraw(uint256 assets) public view virtual returns (uint256) {
    //     return _convertToShares(assets, Math.Rounding.Up);
    // }

    /** @dev See {IERC4626-previewRedeem}. */
    function previewRedeem(
        uint256 shares,
        address receiver,
        uint256 timestamp
    ) public view virtual returns (uint256) {
        return
            _convertToAssets(
            shares,
            _totalInvested[receiver],
            timestamp,
            false,
            Math.Rounding.Down
        );
    }

    //var seconds = new Date().getTime() / 1000;
    /** @dev See {IERC4626-deposit}. */
    function deposit(
        uint256 assets,
        address receiver,
        uint256 timestamp
    ) public virtual returns (uint256) {
        uint256 maxAssets_ = maxDeposit(receiver);
        if (totalAssets() + assets > maxAssets_) {
            revert ERC4626ExceededMaxDeposit(receiver, assets, maxAssets_);
        }

        uint256 shares = previewDeposit(assets, timestamp);

        _deposit(_msgSender(), receiver, assets, shares);

        _addToHolders(receiver);

        uint256 netAssets = getNetValueWithPlatformFee(assets);

        _totalInvested[receiver] += netAssets;
        _totalAssets += netAssets;
        _totalPlatformFees[receiver] += (assets - netAssets);

        return shares;
    }

    function _addToHolders(address receiver) internal {
        for (uint i = 0; i < _holders.length; i++) {
            address holder = _holders[i];
            if (holder == receiver) return;
        }
        _holders.push(receiver);
    }

    /** @dev See {IERC4626-redeem}. */
    function _redeem(
        uint256 shares,
        address receiver,
        address owner,
        uint256 timestamp
    ) internal virtual returns (uint256) {
        uint256 maxShares = maxRedeem(owner);
        if (shares > maxShares) {
            revert ERC4626ExceededMaxRedeem(owner, shares, maxShares);
        }

        uint256 assets = previewRedeem(shares, receiver, timestamp);

        _withdraw(_msgSender(), receiver, owner, assets, shares);

        return assets;
    }

    function redeemAll() public virtual onlyAgent {
        for (uint i = 0; i < _holders.length; i++) {
            address holder = _holders[i];
            if(!Token.isFrozen(holder)) {
                uint256 holderBalance = balanceOf(holder);
                if (holderBalance > 0) {
                    _redeem(holderBalance, holder, holder, getEndTimestamp());
                }
            }
        }
    }

    function withdrawAssets(
        address destination,
        uint256 amount
    ) public virtual onlyAgent {
        SafeERC20.safeTransfer(_asset, destination, amount);
    }

    /**
     * @dev Internal conversion function (from assets to shares) with support for rounding direction.
     */
    function _convertToShares(
        uint256 assets,
        uint256 timestamp,
        Math.Rounding rounding
    ) internal view virtual returns (uint256) {
        //return assets.mulDiv(IERC20(_shareToken).totalSupply() + 10 ** _decimalsOffset(), totalAssets() + 1, rounding);
        return _vestingSchedule(assets, timestamp);
    }

    function _vestingSchedule(
        uint256 totalAllocation,
        uint256 timestamp
    ) internal view virtual returns (uint256 total) {
        if (timestamp < start()) {
            revert("Timestamp before start");
        } else if (timestamp > start() + getDurationTimestamp()) {
            revert("Timestamp after end");
        }

        uint256 netTotalAllocation = getNetValueWithPlatformFee(
            totalAllocation
        );
        UD60x18 netTotalAllocationUd = sixDecimalsToUd(netTotalAllocation); //ud(totalAllocation * BASE_18X6_DECIMALS_DIFF);
        UD60x18 totalUd = netTotalAllocationUd.div(getPriceUd(timestamp));
        total = udToSixDecimals(totalUd);
    }

    function daysDiff(
        uint256 startDate,
        uint256 endDate
    ) internal view virtual returns (uint256 _daysDiff) {
        _daysDiff = (endDate - startDate) / 60 / 60 / 24;
    }

    function getDurationTimestamp() internal view virtual returns (uint256) {
        return duration() * 60 * 60 * 24;
    }

    function getEndTimestamp() internal view virtual returns (uint256) {
        return start() + getDurationTimestamp();
    }

    /**
     * @dev Internal conversion function (from shares to assets) with support for rounding direction.
     */
    function _convertToAssets(
        uint256 shares,
        uint256 totalInvested,
        uint256 timestamp,
        bool netValue,
        Math.Rounding rounding
    ) internal view virtual returns (uint256) {
        // UD60x18 currentValueUd = sixDecimalsToUd(shares).mul(
        //     getPriceUd(timestamp)
        // );
        UD60x18 currentValueUd = sixDecimalsToUd(shares).mul(nominalValue);
        uint256 currentValue = udToSixDecimals(currentValueUd);
        if (netValue) {
            return getNetValueWithIr(totalInvested, currentValue);
        } else {
            return currentValue;
        }
    }

    /**
     * @dev Deposit/mint common workflow.
     */
    function _deposit(
        address caller,
        address receiver,
        uint256 assets,
        uint256 shares
    ) internal virtual {
        // If _asset is ERC777, `transferFrom` can trigger a reentrancy BEFORE the transfer happens through the
        // `tokensToSend` hook. On the other hand, the `tokenReceived` hook, that is triggered after the transfer,
        // calls the vault, which is assumed not malicious.
        //
        // Conclusion: we need to do the transfer before we mint so that any reentrancy would happen before the
        // assets are transferred and before the shares are minted, which is a valid state.
        // slither-disable-next-line reentrancy-no-eth

        SafeERC20.safeTransferFrom(_asset, caller, address(this), assets);
        // ERC20Burnable(address(_asset)).burn(assets);

        _checkAndMint(receiver, shares);
        // _mint(receiver, shares);

        emit Deposit(caller, receiver, assets, shares);
    }

    /**
     * @dev Withdraw/redeem common workflow.
     */
    function _withdraw(
        address caller,
        address receiver,
        address owner,
        uint256 assets,
        uint256 shares
    ) internal virtual {
        // if (caller != owner) {
        //     _spendAllowance(owner, caller, shares);
        // }

        // If _asset is ERC777, `transfer` can trigger a reentrancy AFTER the transfer happens through the
        // `tokensReceived` hook. On the other hand, the `tokensToSend` hook, that is triggered before the transfer,
        // calls the vault, which is assumed not malicious.
        //
        // Conclusion: we need to do the transfer after the burn so that any reentrancy would happen after the
        // shares are burned and after the assets are transferred, which is a valid state.
        _burn(owner, shares);

        IERC20(_asset).transfer(receiver, assets);

        emit Withdraw(caller, receiver, owner, assets, shares);
    }

    function _decimalsOffset() internal view virtual returns (uint8) {
        return 0;
    }

    function getReceiverInfoTimestamp(
        address receiver,
        uint256 timestamp
    )
    public
    view
    virtual
    returns (
        uint256 shares,
        uint256 totalInvested,
        uint256 totalPlatformFee,
        uint256 currentValue,
        uint256 currentNetValue,
        uint256 start_,
        uint256 duration_
    )
    {
        shares = balanceOf(receiver);
        totalInvested = _totalInvested[receiver];
        totalPlatformFee = _totalPlatformFees[receiver];
        currentValue = _convertToAssets(
            balanceOf(receiver),
            totalInvested,
            timestamp,
            false,
            Math.Rounding.Down
        );
        currentNetValue = _convertToAssets(
            balanceOf(receiver),
            totalInvested,
            timestamp,
            false,
            Math.Rounding.Down
        ); //getNetValueWithIr(balance, currentValue);
        start_ = start();
        duration_ = duration();
    }

    function getReceiverInfo(
        address receiver
    )
    public
    view
    virtual
    returns (
        uint256 shares,
        uint256 totalInvested,
        uint256 totalPlatformFee,
        uint256 currentValue,
        uint256 currentNetValue,
        uint256 start_,
        uint256 duration_
    )
    {
        return getReceiverInfoTimestamp(receiver, block.timestamp);
    }

    // function setNominalValue(uint256 daysToMaturity) internal virtual returns (UD60x18) {
    //     UD60x18 _daysToMaturity = ud(daysToMaturity * 1e18);
    //     UD60x18 x = ONE_UD.add(yieldUd);
    //     UD60x18 y = _daysToMaturity.div(DAYS_IN_A_YEAR_UD);
    //     nominalValue = x.pow(y);
    //     return nominalValue;
    // }

    function getPrice(
        uint256 currentTimestamp
    ) public view returns (uint256 result) {
        result = udToSixDecimals(getPriceUd(currentTimestamp));
    }

    function getPriceUd(
        uint256 currentTimestamp
    ) internal view virtual returns (UD60x18 result) {
        uint256 _daysDiff = daysDiff(start(), currentTimestamp);
        uint256 remainingDays = 0;
        if (_daysDiff < duration()) {
            remainingDays = duration() - _daysDiff;
        }
        UD60x18 _daysToMaturity = ud(remainingDays * 1e18);
        UD60x18 one = ud(1e18);
        // console.log("yield", yieldUd.intoUint256());
        UD60x18 x = one.add(yieldUd);
        UD60x18 y = _daysToMaturity.div(DAYS_IN_A_YEAR_UD);
        UD60x18 base = x.pow(y);
        result = nominalValue.div(base);
        // console.log("price", result.intoUint256());
    }

    function udToSixDecimals(
        UD60x18 x
    ) internal view virtual returns (uint256) {
        return x.intoUint256() / BASE_18X6_DECIMALS_DIFF;
    }

    function sixDecimalsToUd(
        uint256 x
    ) internal view virtual returns (UD60x18) {
        return ud(x * BASE_18X6_DECIMALS_DIFF);
    }

    function getNetValueWithIr(
        uint256 totalInvested,
        uint256 currentValue
    ) internal view virtual returns (uint256) {
        uint256 profit = currentValue - totalInvested;
        UD60x18 profitUd = sixDecimalsToUd(profit);
        UD60x18 currentValueUd = sixDecimalsToUd(currentValue);
        uint256 netValue = udToSixDecimals(
            currentValueUd.sub(profitUd.mul(IR_TAX_FEE_UD))
        );
        return netValue;
    }

    function getNetValueWithPlatformFee(
        uint256 value
    ) internal view virtual returns (uint256) {
        UD60x18 valueUd = sixDecimalsToUd(value);
        uint256 netValue = udToSixDecimals(
            valueUd.mul(ONE_UD.sub(PLATFORM_FEE_UD))
        );
        return netValue;
    }
}
