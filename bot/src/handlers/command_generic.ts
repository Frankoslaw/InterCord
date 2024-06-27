import { Pipeline } from "../utils/pipeline";

export class UniversalContext {
    [key: string]: any;
}

export abstract class GenericHandler {
    abstract to_ctx(...args: any[]): UniversalContext;
    abstract from_ctx(): void;
}

export class UniversalCommand {
    name!: string;
    description!: string;
    handlers!: [GenericHandler];
    steps: Pipeline<UniversalContext> = Pipeline<UniversalContext>()
}
