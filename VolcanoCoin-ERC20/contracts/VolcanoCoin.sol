// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract VolcanoCoin is ERC20("Volcano Coin", "VLC"), Ownable{
    
    uint256  paymentID;
    uint256  constant initialSupply = 10000;

    address immutable administrator;
    enum PaymentTypes { UNKNOWN, BASICPAYMENT, REFUND, DIVIDEND, GROUPPAYMENT }
   
    struct Payment{
        uint amount;
        address recipient;
        uint timeStamp;
        string comment;
        uint paymentID;
        PaymentTypes paymentType;
    }
    
    struct RecordIndex {
        address user;
        uint256 arrayIndex;
    }
    
    mapping (address => Payment[])  payments;
    mapping (uint256 => RecordIndex)  RecordIDs;

    event supplyChanged(uint256);

    
    constructor() {
        _mint( _msgSender(), initialSupply);
        administrator =  _msgSender();
    }
    

    
    function transfer(address _recipient, uint _amount) public virtual override returns (bool) {
        _transfer( _msgSender(), _recipient, _amount);
        uint256 newID = ++paymentID;
        payments[ _msgSender()].push(Payment(_amount,_recipient, block.timestamp,"", newID, PaymentTypes.UNKNOWN ));
        RecordIDs[newID] = RecordIndex({user :  _msgSender(), arrayIndex : payments[ _msgSender()].length -1 });
        return true;
    }
    
    function findPaymentDetailsIndex(uint _id) internal view returns(address, uint256) {
        RecordIndex memory recordIndex =  RecordIDs[_id];
        address user = recordIndex.user;
        require(user != address(0),"Payment Record not found");
        uint256 arrayIndex = recordIndex.arrayIndex;
        return (user,arrayIndex);        
    }
    
    function updatePaymentDetails(uint _id, PaymentTypes _type, string memory _comment) public{
        (address user, uint256 arrayIndex) =  findPaymentDetailsIndex(_id);
        require (user== _msgSender() ||  _msgSender()==administrator, "Only Owner or administrator");
           string memory comment = _comment;
           if( _msgSender()==administrator){
               string memory adminAddress = Strings.toHexString(uint256(uint160(administrator)));
                comment=string(abi.encodePacked(_comment, " updated by ",adminAddress));
           }
           Payment[] storage userPayments = payments[user];
           userPayments[arrayIndex].comment=comment;
           userPayments[arrayIndex].paymentType=_type;
    }

    function addToTotalSupply(uint256 _quantity) public onlyOwner {
        _mint( _msgSender(),_quantity);
        emit supplyChanged(_quantity);
    }
    
   function getPayments(address _user) public view returns (Payment[] memory) {
       return payments[_user];
   }
}