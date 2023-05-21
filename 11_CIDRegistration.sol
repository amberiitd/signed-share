// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract CIDRegistration{

    /*
     *  Events
    */
    event CIDRegistered(address _uploaderAddress, string _cid);

    /*
     *  Storage
    */
    using Counters for Counters.Counter;
    using SafeMath for uint256;

    Counters.Counter public uploadersCount;

    struct entryContent{
        string CID;
        uint256 lastModified;
        uint256 timestamp;
        string fileName;
        uint256 sizeInKB;
        string fileType;
        address uploader;
    }

    struct CIDContent{
        address user;
        uint256 lastModified;
        uint256 timestamp;
        string fileName;
        uint256 sizeInKB;
        string fileType;
    }

    mapping(string => CIDContent) public CIDMappedData;

    struct id{
        bool isValid;
        uint256 idx;
    }

    //mapping(address => entryContent[]) public database;
    entryContent[][] public database;
    mapping(address => id) public isAlreadyPresent;
    address[] public uploaderInfo;

    // Constructor.
    constructor() {// 1e16 = 0.01 matic
    }

    function registerCID(string memory _cid, uint256 _lastModified, string memory _fileName, uint256 _sizeInKB, string memory _fileType) external {
        
        // Get the current course id to access the database and update the states.
        entryContent memory _entryVal;
        _entryVal.CID = _cid;
        _entryVal.lastModified = _lastModified;
        _entryVal.timestamp = block.timestamp;
        _entryVal.fileName = _fileName;
        _entryVal.sizeInKB = _sizeInKB;
        _entryVal.fileType = _fileType;
        _entryVal.uploader = msg.sender;

        CIDMappedData[_cid].user = msg.sender;
        CIDMappedData[_cid].lastModified = _lastModified;
        CIDMappedData[_cid].timestamp = block.timestamp;
        CIDMappedData[_cid].fileName = _fileName;
        CIDMappedData[_cid].sizeInKB = _sizeInKB;
        CIDMappedData[_cid].fileType = _fileType;
        
        if(isAlreadyPresent[msg.sender].isValid == false){
            uploaderInfo.push(msg.sender);
            
            isAlreadyPresent[msg.sender].isValid = true;
            isAlreadyPresent[msg.sender].idx = uploadersCount.current();

            database.push();  // Create new array in the database
            database[uploadersCount.current()].push(_entryVal);

            uploadersCount.increment();
        }
        else{
            database[isAlreadyPresent[msg.sender].idx].push(_entryVal);
        }

        emit CIDRegistered(msg.sender, _cid);
    }

    function returnUploader() external view returns(address[] memory) {

        return uploaderInfo;
    }

    function returnData() external view returns(entryContent[][] memory){

        return database;
    }

    function returnIndividualUploaderData() external view returns(entryContent[] memory){

        entryContent[] memory _temp;

        if(isAlreadyPresent[msg.sender].isValid){
            return database[isAlreadyPresent[msg.sender].idx];    
        }

        return _temp;
    }

    function returnCIDMappedData(string memory _cid) external view returns(CIDContent memory){

        return CIDMappedData[_cid];
    }

}