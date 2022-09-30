import "./PublicRandomService.sol";
contract Demo {

  PublicRandomService random_service;
  mapping( address => uint256 ) public wins;

  constructor( address _random_service_addr ) {
    random_service = PublicRandomService( payable(_random_service_addr) );
  }

  function lottery( ) public {
    uint256 rnd = random_service.rand( uint256(uint160(msg.sender)) );
    if( rnd % 2 == 0 ) wins[ msg.sender ]++;
  }



}
