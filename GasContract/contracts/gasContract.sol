// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

contract GasContract is Ownable {

    uint256 public totalSupply = 0;
    uint256 paymentCounter = 1;

    address [5] public administrators;
    enum PaymentType { Unknown, BasicPayment, Refund, Dividend, GroupPayment }
    PaymentType constant defaultPayment = PaymentType.Unknown;

    mapping(address => uint256) public balances;
    mapping(address => Payment[]) payments;
    mapping(address=>uint256) lastUpdateRecord; // when a payment record was last for a user   


    struct Payment {
      uint256 paymentID;
      PaymentType paymentType;
      address recipient;
      string recipientName;  // max 12 characters
      uint256 lastUpdate;
      address updatedBy;
      uint256 amount;
      
    }

    modifier onlyAdmin {
        require (checkForAdmin(msg.sender), "Gas Contract -  Caller not admin" );
        _;
    }

    event supplyChanged(address indexed, uint256 indexed);
    event Transfer(address indexed, uint256);
    event PaymentUpdated(address indexed admin, uint256 indexed ID, uint256 indexed amount, string  recipient);


   constructor(address[] memory _admins) {
      totalSupply = 10000;
      balances[msg.sender] = totalSupply;
      setUpAdmins(_admins);
   }
   
   function welcome() public returns (string memory){
       return "hello !";
   }
   
    function setUpAdmins(address[] memory _admins) public onlyOwner{
        for (uint256 ii = 0;ii<administrators.length ;ii++){
            if(_admins[ii] != address(0)){ 
                administrators[ii] = _admins[ii];
            } 
        }
    }

   function updateTotalSupply() public onlyOwner {
      totalSupply = totalSupply + 1000;
      balances[msg.sender] = totalSupply;
      emit supplyChanged(msg.sender,totalSupply);
   }

   function checkForAdmin(address _user) public view returns (bool) {
       bool admin = false;
       for (uint256 ii = 0; ii< administrators.length;ii++ ){
          if(administrators[ii] ==_user){
              admin = true;
          }
       }
       return admin;
   }
   
   function transfer(address _recipient, uint256 _amount, string memory _name) public {
      require(balances[msg.sender] >= _amount,"Gas Contract - Transfer function - Sender has insufficient Balance");
      require(bytes(_name).length < 13,"Gas Contract - Transfer function -  The recipient name is too long, there is a max length of 12 characters");
      balances[msg.sender] -= _amount;
      balances[_recipient] += _amount;
      emit Transfer(_recipient, _amount);
      Payment memory payment;
      payment.paymentType = PaymentType.BasicPayment;
      payment.recipient = _recipient;
      payment.amount = _amount;
      payment.recipientName = _name;
      payment.paymentID = ++paymentCounter;
      payments[msg.sender].push(payment);
   }
     
    function updatePayment(address _user, uint256 _ID, uint128 _amount) public onlyAdmin {
        require(_ID > 0,"Gas Contract - Update Payment function - ID must be greater than 0");
        require(_amount > 0,"Gas Contract - Update Payment function - Amount must be greater than 0");
        require(_user != address(0) ,"Gas Contract - Update Payment function - Administrator must have a valid non zero address");
        for (uint256 ii=0;ii<payments[_user].length;ii++){
            Payment memory thisPayment = payments[_user][ii];
            uint256 lastUpdate = block.timestamp;
            address updatedBy = msg.sender;
            
            if(thisPayment.paymentID==_ID){
               payments[_user][ii].lastUpdate =  lastUpdate;
               payments[_user][ii].updatedBy = updatedBy;
               payments[_user][ii].amount = _amount;
               lastUpdateRecord[msg.sender] = block.timestamp;
               emit PaymentUpdated(msg.sender, _ID, _amount,payments[_user][ii].recipientName);
            }
        }
    }


   function getPayments(address _user) public view returns (Payment[] memory) {
       require(_user != address(0) ,"Gas Contract - getPayments function - User must have a valid non zero address");
       return payments[_user];
   }
}