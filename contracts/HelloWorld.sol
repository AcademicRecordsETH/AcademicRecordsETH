pragma solidity ^0.4.21;
contract HelloWorld {

    event ElementCreated(uint indexed id, address indexed owner, string name);

    struct MyStruct {
        uint id;
        address owner;
        string name;
    }

    MyStruct[] public myArray;

    mapping(address => uint) public ownerToElementId;

    modifier ownerNotExists() {

        uint elementId = ownerToElementId[msg.sender];
        require(myArray.length == 0 || (myArray.length > elementId && myArray[elementId].owner != msg.sender));
        _;
    }

    function addElement(string _name) external 
        ownerNotExists() {

        uint id = myArray.push(MyStruct(myArray.length, msg.sender, _name)) - 1;
        ownerToElementId[msg.sender] = id;
        emit ElementCreated(id, msg.sender, _name);
    }

    function payment(address _address) external payable {
        _address.transfer(msg.value);
    } 

    function getOwnerToElementId(address _ownerAddress) external view 
        returns(uint elementId) {

        elementId = ownerToElementId[_ownerAddress];
    }
}

