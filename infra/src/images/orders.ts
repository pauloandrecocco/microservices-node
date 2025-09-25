import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as docker from "@pulumi/docker-build";

const ordersECRRepository = new awsx.ecr.Repository("orders-ecr", {
  forceDelete: true,
});

const ordersECRToken = aws.ecr.getAuthorizationTokenOutput({
  registryId: ordersECRRepository.repository.registryId,
});

export const ordersDockerImage = new docker.Image("orders-image", {
  tags: [
    pulumi.interpolate`${ordersECRRepository.repository.repositoryUrl}:latest`,
  ], // Para controlar versões das imagens
  context: {
    location: "../app-orders", // Onde está o docker file
  },
  push: true, // Fazer o build da imagem e jogar para dentro do repositório
  platforms: ["linux/amd64"], // Para quais plataformas será criada a imagem
  registries: [
    {
      address: ordersECRRepository.repository.repositoryUrl, // Joga a imagem nesse endereço
      username: ordersECRToken.userName,
      password: ordersECRToken.password,
    },
  ],
});
