export class JsonParser {
  parse(raw: string): unknown {
    return JSON.parse(raw);
  }
}
