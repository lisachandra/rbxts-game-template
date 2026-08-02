import { CenturionType, Command, type CommandContext, Register } from "@rbxts/centurion";

@Register()
export class ExampleCommand {
	@Command({
		description: "Replies with a friendly greeting.",
		name: "greet",
	})
	public greet(ctx: CommandContext): void {
		ctx.reply("Hello from the template!");
	}

	@Command({
		arguments: [
			{
				type: CenturionType.String,
				description: "The message to echo back",
				name: "message",
			},
		],
		description: "Echoes a message back to the caller.",
		name: "echo",
	})
	public echo(ctx: CommandContext, message: string): void {
		ctx.reply(message);
	}
}
