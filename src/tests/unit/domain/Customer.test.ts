import { Customer } from "../../../domain/Customer";
import { ValidationUtils } from "../../../utils/ValidationUtils";
import { InvalidTypeException } from "../../../exceptions/InvalidTypeException";
import { NameTooShortException } from "../../../exceptions/NameTooShortException";
import { InvalidEmailFormatException } from "../../../exceptions/InvalidEmailFormatException";
import { NegativeCreditAmountException } from "../../../exceptions/NegativeCreditAmountException";
import { EmptyNameException } from "../../../exceptions/EmptyNameException";

jest.mock("../../../utils/ValidationUtils");

describe("Customer", () => {
  const id = "1";
  let customer: Customer;

  beforeEach(() => {
    jest.clearAllMocks(); // clears call state and return values.
    jest.restoreAllMocks(); // resets mocks to their original behavior.
    jest.resetAllMocks(); // resets the state of all mocks, removing any special configuration you've made.
    customer = new Customer(id, "John Doe", "john.doe@example.com", 100);
  });

  describe("constructor", () => {
    it("should create a customer with valid properties", () => {
      expect(customer.getId()).toBe(id);
      expect(customer.getName()).toBe("John Doe");
      expect(customer.getEmail()).toBe("john.doe@example.com");
      expect(customer.getAvailableCredit()).toBe(100);
    });

    it("should throw InvalidTypeException if name is not a string", () => {
      const name = 123;
      (ValidationUtils.validateName as jest.Mock).mockImplementation(() => {
        throw new InvalidTypeException("name", "string", name);
      });
      expect(
        () => new Customer(id, name as any, "john.doe@example.com", 100)
      ).toThrow(new InvalidTypeException("name", "string", name));
    });

    it("should throw EmptyNameException if name is less than 3 characters", () => {
      (ValidationUtils.validateName as jest.Mock).mockImplementation(() => {
        throw new EmptyNameException();
      });
      expect(() => new Customer(id, "", "john.doe@example.com", 100)).toThrow(
        new EmptyNameException()
      );
    });

    it("should throw NameTooShortException if name is less than 3 characters", () => {
      (ValidationUtils.validateName as jest.Mock).mockImplementation(() => {
        throw new NameTooShortException();
      });
      expect(() => new Customer(id, "Jo", "john.doe@example.com", 100)).toThrow(
        new NameTooShortException()
      );
    });

    it("should throw InvalidEmailFormatException if email is invalid", () => {
      (ValidationUtils.validateEmailFormat as jest.Mock).mockImplementation(
        () => {
          throw new InvalidEmailFormatException();
        }
      );
      expect(() => new Customer(id, "John Doe", "invalidEmail", 100)).toThrow(
        new InvalidEmailFormatException()
      );
    });

    it("should throw InvalidTypeException if email is invalid", () => {
      const invalidEmail = 1;
      (ValidationUtils.validateEmailFormat as jest.Mock).mockImplementation(
        () => {
          throw new InvalidTypeException("email", "string", invalidEmail);
        }
      );
      expect(
        () => new Customer(id, "John Doe", invalidEmail as any, 100)
      ).toThrow(new InvalidTypeException("email", "string", invalidEmail));
    });

    it("should throw InvalidTypeException if availableCredit is negative", () => {
      const invalidAvailableCredit = "a";
      (ValidationUtils.validateAmount as jest.Mock).mockImplementation(() => {
        throw new InvalidTypeException(
          "amount",
          "number",
          invalidAvailableCredit
        );
      });
      expect(
        () =>
          new Customer(
            id,
            "John Doe",
            "john.doe@example.com",
            invalidAvailableCredit as any
          )
      ).toThrow(
        new InvalidTypeException("amount", "number", invalidAvailableCredit)
      );
    });

    it("should create a customer with default availableCredit of 0 if not specified", () => {
      const customerWithoutCredit = new Customer(id, "John Doe", "john.doe@example.com");
      expect(customerWithoutCredit.getAvailableCredit()).toBe(0);
    });
    
  });

  describe("getters", () => {
    it("should return the correct id", () => {
      expect(customer.getId()).toBe(id);
    });

    it("should return the correct name", () => {
      expect(customer.getName()).toBe("John Doe");
    });

    it("should return the correct email", () => {
      expect(customer.getEmail()).toBe("john.doe@example.com");
    });

    it("should return the correct available credit", () => {
      expect(customer.getAvailableCredit()).toBe(100);
    });
  });

  describe("setters", () => {
    it("should set a valid name", () => {
      customer.setName("Jane Doe");
      expect(customer.getName()).toBe("Jane Doe");
    });

    it("should throw EmptyNameException if new name is less than 3 characters", () => {
      (ValidationUtils.validateName as jest.Mock).mockImplementation(() => {
        throw new EmptyNameException();
      });
      expect(() => customer.setName("")).toThrow(new EmptyNameException());
    });

    it("should throw InvalidTypeException if name is not a string", () => {
      const name = 123;
      (ValidationUtils.validateName as jest.Mock).mockImplementation(() => {
        throw new InvalidTypeException("name", "string", name);
      });
      expect(() => customer.setName("Jo")).toThrow(
        new InvalidTypeException("name", "string", name)
      );
    });

    it("should throw NameTooShortException if new name is less than 3 characters", () => {
      (ValidationUtils.validateName as jest.Mock).mockImplementation(() => {
        throw new NameTooShortException();
      });
      expect(() => customer.setName("Jo")).toThrow(new NameTooShortException());
    });

    it("should set email correctly", () => {
      const newEmail = "john.doe.NEW@example.com";
      customer.setEmail(newEmail);
      expect(customer.getEmail()).toBe(newEmail);
    });

    it("should throw InvalidEmailFormatException if new email is invalid", () => {
      (ValidationUtils.validateEmailFormat as jest.Mock).mockImplementation(
        () => {
          throw new InvalidEmailFormatException();
        }
      );
      expect(() => customer.setEmail("invalidEmail")).toThrow(
        new InvalidEmailFormatException()
      );
    });

    it("should throw InvalidTypeException if new email is invalid", () => {
      const invalidEmail = 1;
      (ValidationUtils.validateEmailFormat as jest.Mock).mockImplementation(
        () => {
          throw new InvalidTypeException("email", "string", invalidEmail);
        }
      );
      expect(() => customer.setEmail("invalidEmail")).toThrow(
        new InvalidTypeException("email", "string", invalidEmail)
      );
    });

    it("should set available credit correctly", () => {
      customer.setAvailableCredit(200);
      expect(customer.getAvailableCredit()).toBe(200);
    });

    it("should throw InvalidTypeException if new availableCredit is not a number", () => {
      const invalidAvailableCredit = "notANumber";
      (ValidationUtils.validateAmount as jest.Mock).mockImplementation(
        () => {
          throw new InvalidTypeException(
            "amount",
            "number",
            invalidAvailableCredit
          );
        }
      );
      expect(() => customer.setAvailableCredit("notANumber" as any)).toThrow(
        new InvalidTypeException(
          "amount",
          "number",
          invalidAvailableCredit
        )
      );
    });
  });

  describe("addCredit", () => {
    it("should add credit correctly", () => {
      customer.addCredit(50);
      expect(customer.getAvailableCredit()).toBe(150);
    });

    it("should throw NegativeCreditAmountException if added credit is negative", () => {
      (ValidationUtils.validateAvailableCredit as jest.Mock).mockImplementation(
        () => {
          throw new NegativeCreditAmountException();
        }
      );
      expect(() => customer.addCredit(-10)).toThrow(
        new NegativeCreditAmountException()
      );
    });

    it("should throw InvalidTypeException if added credit is not a number", () => {
      const invalidAvailableCredit = "notANumber";
      (ValidationUtils.validateAvailableCredit as jest.Mock).mockImplementation(
        () => {
          throw new InvalidTypeException(
            "amount",
            "number",
            invalidAvailableCredit
          );
        }
      );
      expect(() => customer.addCredit("notANumber" as any)).toThrow(
        new InvalidTypeException("amount", "number", invalidAvailableCredit)
      );
    });
  });
});
