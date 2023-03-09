export const getAllowedWeight = (ticketClass:string) => {
    switch (ticketClass) {
        case "First-Class":
            return 40;
        case "Business-Class":
            return 30;
        case "Economy-Class":
            return 20
        default:
            return 20;
    }
}