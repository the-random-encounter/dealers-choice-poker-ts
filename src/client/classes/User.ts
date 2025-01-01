export default class User {
    userId: number;
    username: string;
    displayName: string;
    email: string;
    password: string;
    personalDetails: {
        firstName: string;
        lastName: string;
        dateOfBirth: Date;
        address: {
            street: string;
            city: string;
            state: string;
            zip: string;
        };
        country: string;
        phoneNumber: string;
        gender: string;
    }
    wallet: number;
    accountChips: number;

    constructor(
        username: string,
        email: string,
        password: string,
        fName: string,
        lName: string,
        dob: Date,
        addStreet: string,
        addCity: string,
        addState: string,
        addZip: string,
        country: string,
        phone: string,
        gender: string,
        displayName = username
    ) {
        this.username = username;
        this.displayName = displayName;
        this.email = email;
        this.password = password;
        this.personalDetails.firstName = fName;
        this.personalDetails.lastName = lName;
        this.personalDetails.dateOfBirth = dob;
        this.personalDetails.address.street = addStreet;
        this.personalDetails.address.city = addCity;
        this.personalDetails.address.state = addState;
        this.personalDetails.address.zip = addZip;
        this.personalDetails.country = country;
        this.personalDetails.phoneNumber = phone;
        this.personalDetails.gender = gender;
    }

    getDisplayName(): string {
        return this.displayName;
    }

    setDisplayName(displayName: string): void {
        this.displayName = displayName;
    }

    getEmail(): string {
        return this.email;
    }

    setEmail(email: string): void {
        this.email = email;
    }


}