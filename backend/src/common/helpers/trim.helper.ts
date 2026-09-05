export class TransformHelper {
  public static trim(this: void, { value }: { value: string }): string {
    return value ? value.toString().trim() : value;
  }
  public static toPhone(
    this: void,
    { value }: { value: unknown },
  ): string | undefined {
    if (typeof value === 'string') {
      const cleaned = value.replace(/\D/g, '');
      return cleaned.length > 0 ? cleaned : undefined;
    }
    return value as undefined;
  }
}
