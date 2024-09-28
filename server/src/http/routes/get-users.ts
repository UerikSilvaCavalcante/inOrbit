import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { GetUsers } from "../../functions/get-users";

export const getUsers: FastifyPluginAsyncZod = async (app) => {
	app.get("/Users", async () => {
		const { response } = await GetUsers();

		return { response };
	});
};
