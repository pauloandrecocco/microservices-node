import * as awsx from "@pulumi/awsx";

export const cluster = new awsx.classic.ecs.Cluster("app-cluster"); // Cluster: Agrupamento de vários serviços que pertencem a uma mesma aplicação
