import { store } from "@lisachandra/core/store";
import { Components } from "@lisachandra/matter";
import { adminOrDeveloper } from "@lisachandra/platform";
import { CenturionType, Command, Register } from "@rbxts/centurion";
import type { CommandContext } from "@rbxts/centurion";

@Register()
export class ExampleCommand {
	@Command({
		description: "Replies with template server information.",
		name: "templateStatus",
	})
	public status(ctx: CommandContext): void {
		ctx.reply("rbxts-game-template server is running.");
	}

	@Command({
		arguments: [
			{
				type: CenturionType.String,
				description: "Message to echo back to the caller",
				name: "message",
			},
		],
		description: "Echoes a message back to the caller.",
		name: "echo",
	})
	public echo(ctx: CommandContext, message: string): void {
		ctx.reply(message);
	}

	@Command({
		description: "Prints the number of live player sessions. Developer only.",
		name: "sessionCount",
	})
	public count(ctx: CommandContext): void {
		if (!adminOrDeveloper(ctx)) {
			return;
		}

		let sessionCount = 0;
		for (const [_entityId, _session] of store.world.query(Components.Session)) {
			sessionCount += 1;
		}

		ctx.reply(`${sessionCount} session(s)`);
	}
}
