

export default class Top {

  constructor() {
    console.log('Top class instantiated');
  }

  capitalize(value: any): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  destroy(value: any): boolean {

    value = undefined;

    if (value === undefined)
      return true
    else
      return false;
  }
}