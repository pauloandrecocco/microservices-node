import "@opentelemetry/auto-instrumentations-node/register";

import "../broker/subscriber.ts"; // Instanciar assim que iniciar o servidor HTTP de invoices

import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyCors, {
  origin: "*",
});

app.get("/health", () => {
  return { status: "OK" };
});

app.listen({ host: "0.0.0.0", port: 3334 }).then(() => {
  console.log("[Invoices] HTTP Server running!");
});
