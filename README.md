🔹 What is a Calculator Program?

A calculator program takes user input (numbers + operator) and performs mathematical operations like:

Addition
Subtraction
Multiplication
Division
🔸 Basic Calculator Code
# calculator.py

print("Simple Calculator")

# Input
num1 = float(input("Enter first number: "))
num2 = float(input("Enter second number: "))

print("Choose operation:")
print("1. Add (+)")
print("2. Subtract (-)")
print("3. Multiply (*)")
print("4. Divide (/)")

choice = input("Enter choice (1/2/3/4): ")

# Operations
if choice == '1':
    print("Result =", num1 + num2)

elif choice == '2':
    print("Result =", num1 - num2)

elif choice == '3':
    print("Result =", num1 * num2)

elif choice == '4':
    if num2 != 0:
        print("Result =", num1 / num2)
    else:
        print("Error: Division by zero")

else:
    print("Invalid choice")
🔹 How It Works
1. Input
num1 = float(input(...))
Takes number from user
Converts to decimal using float()
2. Operation Selection
choice = input("Enter choice")
3. Condition (if-elif)
Based on user choice, operation is selected
4. Output
print("Result =", result)
🔸 Example Run
Simple Calculator
Enter first number: 10
Enter second number: 5

Choose operation:
1. Add (+)
2. Subtract (-)
3. Multiply (*)
4. Divide (/)

Enter choice: 1

Result = 15
🔥 Advanced Calculator (Loop Version)

👉 Runs again and again until user exits

while True:
    print("\nCalculator Menu")
    
    num1 = float(input("Enter first number: "))
    num2 = float(input("Enter second number: "))

    print("1.Add  2.Subtract  3.Multiply  4.Divide")
    choice = input("Enter choice: ")

    if choice == '1':
        print("Result =", num1 + num2)

    elif choice == '2':
        print("Result =", num1 - num2)

    elif choice == '3':
        print("Result =", num1 * num2)

    elif choice == '4':
        if num2 != 0:
            print("Result =", num1 / num2)
        else:
            print("Cannot divide by zero")

    else:
        print("Invalid choice")

    cont = input("Do you want to continue? (y/n): ")
    if cont.lower() != 'y':
        print("Calculator Closed")
        break
🔹 Features Covered

✅ Input / Output
✅ Type Casting (float)
✅ Conditional Statements
✅ Loop (while)
✅ Error Handling (division by zero)...
