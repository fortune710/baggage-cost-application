export function generate12CharId() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let id = "";
    for (let i = 0; i < 12; i++) {
      const randomChar = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
      id += randomChar;
    }
    return id;
}
  