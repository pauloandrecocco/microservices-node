import * as awsx from "@pulumi/awsx";
import { cluster } from "../cluster";
import { appLoadBalancer } from "../load-balancer";

// Para quais instâncias o LB vai enviar requisições
// Distribui acessos às instâncias
const rabbitMQAdminTargetGroup = appLoadBalancer.createTargetGroup(
  "rabbitmq-admin-target",
  {
    port: 15672, // Porta que a aplicação está rodando,
    protocol: "HTTP",
    healthCheck: {
      path: "/",
      protocol: "HTTP",
    },
  }
);

// Listener vai ouvir as requisições do usuário para dentro do LB
export const rabbitMQAdminHttpListener = appLoadBalancer.createListener(
  "rabbitmq-admin-listener",
  {
    port: 15672, // Porta que vai usar quando o usuário está acessando URL do LB
    protocol: "HTTP",
    targetGroup: rabbitMQAdminTargetGroup,
  }
);

export const rabbitMQService = new awsx.classic.ecs.FargateService(
  "fargate-rabbitmq",
  {
    cluster,
    desiredCount: 1,
    waitForSteadyState: false,
    taskDefinitionArgs: {
      container: {
        image: "rabbitmq:3-management", // Mesma imagem do docker compose
        cpu: 256,
        memory: 512,
        portMappings: [rabbitMQAdminHttpListener],
        environment: [
          {
            name: "RABBITMQ_DEFAULT_USER",
            value: "admin",
          },
          {
            name: "RABBITMQ_DEFAULT_PASS",
            value: "admin",
          },
        ],
      },
    },
  }
);
