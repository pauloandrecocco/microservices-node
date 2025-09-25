import * as awsx from "@pulumi/awsx";
import { cluster } from "./cluster";

export const appLoadBalancer = new awsx.classic.lb.ApplicationLoadBalancer(
  "app-lb",
  {
    securityGroups: cluster.securityGroups, // Forma de determinar qual serviço enxerga qual
  }
);

// LB para outros protocolos além de HTTP/HTTPs
export const networkLoadBalancer = new awsx.classic.lb.NetworkLoadBalancer(
  "net-lb",
  {
    subnets: cluster.vpc.publicSubnetIds,
  }
);
