import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { GetUsers } from "../../functions/get-users";
import { z } from "zod";
import { getUsername } from "../../functions/get-username";



export const GetUsername: FastifyPluginAsyncZod = async (app) => {
	app.post("/username",{
        schema:{
            body: z.object({
                username:z.string(),
                password:z.string()
            }),
        }

    }, async (request) => {
		const { username, password } = await request.body;

		const user = await getUsername({
            username,
            password
        })

        return {user}
	});
};
