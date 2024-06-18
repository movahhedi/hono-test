import { writeFile } from "fs";

const honoInstanceCount = 15;
const routeCount = 200;
const fileName = "src/result.ts";

const imports = `
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { hc } from "hono/client";
`;

const generateRoutes = (honoInstanceCount: number, routeCount: number) => {
	let text: string = imports;

	for (let i = 1; i <= honoInstanceCount; i++) {
		text += `\nexport const app${i} = new Hono()\n`;

		for (let k = 1; k <= routeCount; k++) {
			text += `	.get(
		"/route${k}/:id",
		zValidator(
			"query",
			z.object({
				q1: z.string(),
				q2: z.string(),
				q3: z.string(),
				q4: z.string(),
			})
		),
		(c) => {
			return c.json({
				query: c.req.valid("query"),
				id: c.req.param("id"),
				ok: true,
			});
		}
	)`;
		}

		text += ";\n";
	}

	text += "\n";

	for (let i = 1; i <= honoInstanceCount; i++) {
		text += `const client${i} = hc<typeof app${i}>("/");\n`;
	}

	return text;
};

const content = generateRoutes(honoInstanceCount, routeCount);

writeFile(fileName, content, (err) => {
	if (err) throw err;
	console.log(`${honoInstanceCount} hono instances, each with ${routeCount} routes have been written to ${fileName}`);
});
