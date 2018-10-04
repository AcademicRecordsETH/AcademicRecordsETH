pragma solidity ^0.4.23;
contract Organisations {

    struct Organisation {
        uint id;
        address ownerAddress;
        string name;
        bool isActive;
    }

    struct Administrator {
        uint id; 
        uint organisationId;
        address administratorAddress;
        bool isActive;
    }

    struct Period {
        uint id;
        uint organisationId;
        string name;
        bool isActive;
    }

    Organisation[] public organisations;
    Administrator[] public administrators;
    Period[] public periods;

    mapping(address => uint) public ownerToOrganizationId;
    mapping(address => uint) public administratorToAdministratorId;

    modifier ownerNotExists(address _ownerAddress) {
        require(ownerToOrganizationId[_ownerAddress] == 0);
        _;
    }

    modifier organisationOwner(uint _organisationId) {
        require(organisations[_organisationId].ownerAddress == msg.sender);
        _;
    }

    modifier organisationOwnerAndActive(uint _organisationId) {
        require(organisations[_organisationId].ownerAddress == msg.sender);
        require(organisations[_organisationId].isActive);
        _;
    }

    modifier organisationAdministratorAndActive(uint _organisationId) {

        require(organisations[_organisationId].isActive);
        require(administrators[administratorToAdministratorId[msg.sender]].administratorAddress == msg.sender);
        require(administrators[administratorToAdministratorId[msg.sender]].organisationId == _organisationId);
        require(administrators[administratorToAdministratorId[msg.sender]].isActive);
        _;
    }

    modifier periodActive(uint _periodId) {
        require(periods[_periodId].isActive);
        require(organisations[periods[_periodId].organisationId].isActive);
        _;
    }

    constructor() public {
        
        organisations.push(Organisation(0, 0, '0', false));
        administrators.push(Administrator(0, 0, 0, false));
        periods.push(Period(0, 0, '0', false));
    }

    function createOrganisation(string _name, bool _isActive) external
        ownerNotExists(msg.sender) {

        uint id = organisations.push(Organisation(organisations.length, msg.sender, _name, _isActive)) - 1;
        ownerToOrganizationId[msg.sender] = id;
        emit OrganisationCreated(id, msg.sender, _name, _isActive);
    }

    function updateOrganisationOwner(uint _organisationId, address _ownerAddress) external
        organisationOwner(_organisationId)
        ownerNotExists(_ownerAddress) {

        organisations[_organisationId].ownerAddress = _ownerAddress;
        ownerToOrganizationId[_ownerAddress] = _organisationId;
        ownerToOrganizationId[msg.sender] = 0;
        emit OrganisationOwnerUpdated(_organisationId, _ownerAddress, organisations[_organisationId].name, organisations[_organisationId].isActive);
    }

    function updateOrganisationState(uint _organisationId, bool _isActive) external
        organisationOwner(_organisationId) {

        organisations[_organisationId].isActive = _isActive;
        emit OrganisationStateUpdated(_organisationId, msg.sender, organisations[_organisationId].name, _isActive);
    }

    function createAdministrator(uint _organisationId, address _administratorAddress, bool _isActive) external
        organisationOwnerAndActive(_organisationId) {

        uint administratorId = administratorToAdministratorId[_administratorAddress];
        require(administratorId == 0);

        uint id = administrators.push(Administrator(administrators.length, _organisationId, _administratorAddress, _isActive)) - 1;
        administratorToAdministratorId[_administratorAddress] = id;
        emit AdministratorCreated(id, _organisationId, _administratorAddress, _isActive);
    }

    function updateAdministrator(uint _administratorId, bool _isActive) external
        organisationOwnerAndActive(administrators[_administratorId].organisationId) {

        administrators[_administratorId].isActive = _isActive;
        emit AdministratorUpdated(_administratorId, administrators[_administratorId].organisationId, administrators[_administratorId].administratorAddress, _isActive);
    }

    function createPeriod(uint _organisationId, string _name, bool _isActive) external
        organisationAdministratorAndActive(_organisationId) {

        uint id = periods.push(Period(periods.length, _organisationId, _name, _isActive)) - 1;
        emit PeriodCreated(id, _organisationId, _name, _isActive);
    }

    function updatePeriod(uint _periodId, bool _isActive) external
        organisationAdministratorAndActive(periods[_periodId].organisationId) {

        periods[_periodId].isActive = _isActive;
        emit PeriodUpdated(_periodId, periods[_periodId].organisationId, periods[_periodId].name, _isActive);
    }

    function getOrganisationsLength() external view returns(uint) {

        return organisations.length;
    }

    function getAdministratorsLength() external view returns(uint) {

        return administrators.length;
    }

    function getPeriodsLength() external view returns(uint) {

        return periods.length;
    }

    event OrganisationCreated(uint indexed organisationId, address indexed owner, string name, bool indexed isActive);
    event OrganisationOwnerUpdated(uint indexed organisationId, address indexed owner, string name, bool indexed isActive);
    event OrganisationStateUpdated(uint indexed organisationId, address indexed owner, string name, bool indexed isActive);

    event AdministratorCreated(uint indexed administratorId, uint indexed organisationId, address indexed administratorAddress, bool isActive);
    event AdministratorUpdated(uint indexed administratorId, uint indexed organisationId, address indexed administratorAddress, bool isActive);

    event PeriodCreated(uint indexed periodId, uint indexed organisationId, string name, bool indexed isActive);
    event PeriodUpdated(uint indexed periodId, uint indexed organisationId, string name, bool indexed isActive);
    
    /*
    event OrganisationEvent(uint indexed organisationId, address indexed owner, string name, bool indexed isActive);
    event AdministratorEvent(uint indexed administratorId, uint indexed organisationId, address indexed administratorAddress, bool isActive);
    event PeriodEvent(uint indexed periodId, uint indexed organisationId, string name, bool indexed isActive);
    */
}