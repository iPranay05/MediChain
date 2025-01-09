/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  HealthcareSystem,
  HealthcareSystemInterface,
} from "../HealthcareSystem";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "aadharNumber",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "HealthCoinsAwarded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "aadharNumber",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "HealthCoinsRedeemed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "aadharNumber",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "hospital",
        type: "address",
      },
    ],
    name: "PrescriptionAdded",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_aadharNumber",
        type: "string",
      },
      {
        internalType: "string",
        name: "_diagnosis",
        type: "string",
      },
      {
        internalType: "string",
        name: "_medication",
        type: "string",
      },
      {
        internalType: "string",
        name: "_dosage",
        type: "string",
      },
      {
        internalType: "string",
        name: "_notes",
        type: "string",
      },
    ],
    name: "addPrescription",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_aadharNumber",
        type: "string",
      },
    ],
    name: "getHealthCoins",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_aadharNumber",
        type: "string",
      },
    ],
    name: "getPrescriptions",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "diagnosis",
            type: "string",
          },
          {
            internalType: "string",
            name: "medication",
            type: "string",
          },
          {
            internalType: "string",
            name: "dosage",
            type: "string",
          },
          {
            internalType: "string",
            name: "notes",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "hospital",
            type: "address",
          },
        ],
        internalType: "struct HealthcareSystem.Prescription[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "healthCoins",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "prescriptions",
    outputs: [
      {
        internalType: "string",
        name: "diagnosis",
        type: "string",
      },
      {
        internalType: "string",
        name: "medication",
        type: "string",
      },
      {
        internalType: "string",
        name: "dosage",
        type: "string",
      },
      {
        internalType: "string",
        name: "notes",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "hospital",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_aadharNumber",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "redeemHealthCoins",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_hospital",
        type: "address",
      },
    ],
    name: "registerHospital",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "registeredHospitals",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b506001600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550611a52806100786000396000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c8063931126e91161005b578063931126e91461013e5780639a5a34f71461016e578063c5b998581461019e578063fd189b3c146101ba57610088565b80631abb69261461008d57806326fc9787146100c257806330b84026146100f257806373bd0b6814610122575b600080fd5b6100a760048036038101906100a29190610e5b565b6101d6565b6040516100b996959493929190610f86565b60405180910390f35b6100dc60048036038101906100d7919061102f565b610485565b6040516100e99190611077565b60405180910390f35b61010c60048036038101906101079190611092565b6104a5565b60405161011991906110db565b60405180910390f35b61013c600480360381019061013791906110f6565b6104d3565b005b61015860048036038101906101539190611092565b6107b0565b60405161016591906113c5565b60405180910390f35b61018860048036038101906101839190611092565b610ad5565b60405161019591906110db565b60405180910390f35b6101b860048036038101906101b3919061102f565b610afd565b005b6101d460048036038101906101cf9190610e5b565b610be4565b005b600082805160208101820180518482526020830160208501208183528095505050505050818154811061020857600080fd5b90600052602060002090600602016000915091505080600001805461022c90611416565b80601f016020809104026020016040519081016040528092919081815260200182805461025890611416565b80156102a55780601f1061027a576101008083540402835291602001916102a5565b820191906000526020600020905b81548152906001019060200180831161028857829003601f168201915b5050505050908060010180546102ba90611416565b80601f01602080910402602001604051908101604052809291908181526020018280546102e690611416565b80156103335780601f1061030857610100808354040283529160200191610333565b820191906000526020600020905b81548152906001019060200180831161031657829003601f168201915b50505050509080600201805461034890611416565b80601f016020809104026020016040519081016040528092919081815260200182805461037490611416565b80156103c15780601f10610396576101008083540402835291602001916103c1565b820191906000526020600020905b8154815290600101906020018083116103a457829003601f168201915b5050505050908060030180546103d690611416565b80601f016020809104026020016040519081016040528092919081815260200182805461040290611416565b801561044f5780601f106104245761010080835404028352916020019161044f565b820191906000526020600020905b81548152906001019060200180831161043257829003601f168201915b5050505050908060040154908060050160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905086565b60026020528060005260406000206000915054906101000a900460ff1681565b6001818051602081018201805184825260208301602085012081835280955050505050506000915090505481565b600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1661055f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610556906114b9565b60405180910390fd5b600c8551146105a3576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161059a90611525565b60405180910390fd5b6000856040516105b39190611581565b90815260200160405180910390206040518060c001604052808681526020018581526020018481526020018381526020014281526020013373ffffffffffffffffffffffffffffffffffffffff16815250908060018154018082558091505060019003906000526020600020906006020160009091909190915060008201518160000190816106429190611744565b5060208201518160010190816106589190611744565b50604082015181600201908161066e9190611744565b5060608201518160030190816106849190611744565b506080820151816004015560a08201518160050160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550505060646001866040516106ea9190611581565b908152602001604051809103902060008282546107079190611845565b925050819055508460405161071c9190611581565b60405180910390207f5c79ccc773c402f42db14d5cf06e17c7469c9233968bb8543b6835aa3afef2a9336040516107539190611879565b60405180910390a2846040516107699190611581565b60405180910390207f59f0f0b248ea471d929369a9bd39d625509eed5e24c74d1e67f4f823db6c4b9560646040516107a191906118cf565b60405180910390a25050505050565b60606000826040516107c29190611581565b9081526020016040518091039020805480602002602001604051908101604052809291908181526020016000905b82821015610aca57838290600052602060002090600602016040518060c001604052908160008201805461082390611416565b80601f016020809104026020016040519081016040528092919081815260200182805461084f90611416565b801561089c5780601f106108715761010080835404028352916020019161089c565b820191906000526020600020905b81548152906001019060200180831161087f57829003601f168201915b505050505081526020016001820180546108b590611416565b80601f01602080910402602001604051908101604052809291908181526020018280546108e190611416565b801561092e5780601f106109035761010080835404028352916020019161092e565b820191906000526020600020905b81548152906001019060200180831161091157829003601f168201915b5050505050815260200160028201805461094790611416565b80601f016020809104026020016040519081016040528092919081815260200182805461097390611416565b80156109c05780601f10610995576101008083540402835291602001916109c0565b820191906000526020600020905b8154815290600101906020018083116109a357829003601f168201915b505050505081526020016003820180546109d990611416565b80601f0160208091040260200160405190810160405280929190818152602001828054610a0590611416565b8015610a525780601f10610a2757610100808354040283529160200191610a52565b820191906000526020600020905b815481529060010190602001808311610a3557829003601f168201915b50505050508152602001600482015481526020016005820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681525050815260200190600101906107f0565b505050509050919050565b6000600182604051610ae79190611581565b9081526020016040518091039020549050919050565b600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16610b89576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b809061195c565b60405180910390fd5b6001600260008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555050565b80600183604051610bf59190611581565b9081526020016040518091039020541015610c45576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c3c906119c8565b60405180910390fd5b80600183604051610c569190611581565b90815260200160405180910390206000828254610c7391906119e8565b9250508190555081604051610c889190611581565b60405180910390207ff78100b79988ca94aaa795967f9f5d213a54d36607a35040061897d737897d4582604051610cbf91906110db565b60405180910390a25050565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b610d3282610ce9565b810181811067ffffffffffffffff82111715610d5157610d50610cfa565b5b80604052505050565b6000610d64610ccb565b9050610d708282610d29565b919050565b600067ffffffffffffffff821115610d9057610d8f610cfa565b5b610d9982610ce9565b9050602081019050919050565b82818337600083830152505050565b6000610dc8610dc384610d75565b610d5a565b905082815260208101848484011115610de457610de3610ce4565b5b610def848285610da6565b509392505050565b600082601f830112610e0c57610e0b610cdf565b5b8135610e1c848260208601610db5565b91505092915050565b6000819050919050565b610e3881610e25565b8114610e4357600080fd5b50565b600081359050610e5581610e2f565b92915050565b60008060408385031215610e7257610e71610cd5565b5b600083013567ffffffffffffffff811115610e9057610e8f610cda565b5b610e9c85828601610df7565b9250506020610ead85828601610e46565b9150509250929050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610ef1578082015181840152602081019050610ed6565b60008484015250505050565b6000610f0882610eb7565b610f128185610ec2565b9350610f22818560208601610ed3565b610f2b81610ce9565b840191505092915050565b610f3f81610e25565b82525050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610f7082610f45565b9050919050565b610f8081610f65565b82525050565b600060c0820190508181036000830152610fa08189610efd565b90508181036020830152610fb48188610efd565b90508181036040830152610fc88187610efd565b90508181036060830152610fdc8186610efd565b9050610feb6080830185610f36565b610ff860a0830184610f77565b979650505050505050565b61100c81610f65565b811461101757600080fd5b50565b60008135905061102981611003565b92915050565b60006020828403121561104557611044610cd5565b5b60006110538482850161101a565b91505092915050565b60008115159050919050565b6110718161105c565b82525050565b600060208201905061108c6000830184611068565b92915050565b6000602082840312156110a8576110a7610cd5565b5b600082013567ffffffffffffffff8111156110c6576110c5610cda565b5b6110d284828501610df7565b91505092915050565b60006020820190506110f06000830184610f36565b92915050565b600080600080600060a0868803121561111257611111610cd5565b5b600086013567ffffffffffffffff8111156111305761112f610cda565b5b61113c88828901610df7565b955050602086013567ffffffffffffffff81111561115d5761115c610cda565b5b61116988828901610df7565b945050604086013567ffffffffffffffff81111561118a57611189610cda565b5b61119688828901610df7565b935050606086013567ffffffffffffffff8111156111b7576111b6610cda565b5b6111c388828901610df7565b925050608086013567ffffffffffffffff8111156111e4576111e3610cda565b5b6111f088828901610df7565b9150509295509295909350565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b600082825260208201905092915050565b600061124582610eb7565b61124f8185611229565b935061125f818560208601610ed3565b61126881610ce9565b840191505092915050565b61127c81610e25565b82525050565b61128b81610f65565b82525050565b600060c08301600083015184820360008601526112ae828261123a565b915050602083015184820360208601526112c8828261123a565b915050604083015184820360408601526112e2828261123a565b915050606083015184820360608601526112fc828261123a565b91505060808301516113116080860182611273565b5060a083015161132460a0860182611282565b508091505092915050565b600061133b8383611291565b905092915050565b6000602082019050919050565b600061135b826111fd565b6113658185611208565b93508360208202850161137785611219565b8060005b858110156113b35784840389528151611394858261132f565b945061139f83611343565b925060208a0199505060018101905061137b565b50829750879550505050505092915050565b600060208201905081810360008301526113df8184611350565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061142e57607f821691505b602082108103611441576114406113e7565b5b50919050565b7f4f6e6c79207265676973746572656420686f73706974616c732063616e20616460008201527f6420707265736372697074696f6e730000000000000000000000000000000000602082015250565b60006114a3602f83610ec2565b91506114ae82611447565b604082019050919050565b600060208201905081810360008301526114d281611496565b9050919050565b7f496e76616c696420416164686172206e756d6265720000000000000000000000600082015250565b600061150f601583610ec2565b915061151a826114d9565b602082019050919050565b6000602082019050818103600083015261153e81611502565b9050919050565b600081905092915050565b600061155b82610eb7565b6115658185611545565b9350611575818560208601610ed3565b80840191505092915050565b600061158d8284611550565b915081905092915050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026115fa7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826115bd565b61160486836115bd565b95508019841693508086168417925050509392505050565b6000819050919050565b600061164161163c61163784610e25565b61161c565b610e25565b9050919050565b6000819050919050565b61165b83611626565b61166f61166782611648565b8484546115ca565b825550505050565b600090565b611684611677565b61168f818484611652565b505050565b5b818110156116b3576116a860008261167c565b600181019050611695565b5050565b601f8211156116f8576116c981611598565b6116d2846115ad565b810160208510156116e1578190505b6116f56116ed856115ad565b830182611694565b50505b505050565b600082821c905092915050565b600061171b600019846008026116fd565b1980831691505092915050565b6000611734838361170a565b9150826002028217905092915050565b61174d82610eb7565b67ffffffffffffffff81111561176657611765610cfa565b5b6117708254611416565b61177b8282856116b7565b600060209050601f8311600181146117ae576000841561179c578287015190505b6117a68582611728565b86555061180e565b601f1984166117bc86611598565b60005b828110156117e4578489015182556001820191506020850194506020810190506117bf565b8683101561180157848901516117fd601f89168261170a565b8355505b6001600288020188555050505b505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061185082610e25565b915061185b83610e25565b925082820190508082111561187357611872611816565b5b92915050565b600060208201905061188e6000830184610f77565b92915050565b6000819050919050565b60006118b96118b46118af84611894565b61161c565b610e25565b9050919050565b6118c98161189e565b82525050565b60006020820190506118e460008301846118c0565b92915050565b7f4f6e6c79207265676973746572656420686f73706974616c732063616e20726560008201527f676973746572206e657720686f73706974616c73000000000000000000000000602082015250565b6000611946603483610ec2565b9150611951826118ea565b604082019050919050565b6000602082019050818103600083015261197581611939565b9050919050565b7f496e73756666696369656e74206865616c746820636f696e7300000000000000600082015250565b60006119b2601983610ec2565b91506119bd8261197c565b602082019050919050565b600060208201905081810360008301526119e1816119a5565b9050919050565b60006119f382610e25565b91506119fe83610e25565b9250828203905081811115611a1657611a15611816565b5b9291505056fea2646970667358221220018bc3cee55179e6096b2084c617a1557d91962f2228057d940ae3c382162ea964736f6c63430008130033";

type HealthcareSystemConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: HealthcareSystemConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class HealthcareSystem__factory extends ContractFactory {
  constructor(...args: HealthcareSystemConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string }
  ): Promise<HealthcareSystem> {
    return super.deploy(overrides || {}) as Promise<HealthcareSystem>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): HealthcareSystem {
    return super.attach(address) as HealthcareSystem;
  }
  override connect(signer: Signer): HealthcareSystem__factory {
    return super.connect(signer) as HealthcareSystem__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): HealthcareSystemInterface {
    return new utils.Interface(_abi) as HealthcareSystemInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): HealthcareSystem {
    return new Contract(address, _abi, signerOrProvider) as HealthcareSystem;
  }
}
