-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('LOCAL', 'GOOGLE');

-- CreateEnum
CREATE TYPE "TransactionCategory" AS ENUM ('SALARY', 'FREELANCE', 'INVESTMENTS', 'BANK_FEES', 'CITY_TAXES', 'MORTGAGE', 'GAS', 'ELECTRICITY', 'INTERNET', 'FOOD', 'TRANSPORT', 'ENTERTAINMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('ASSET', 'LIABILITY');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "phoneNumber" TEXT,
    "phoneNumberVerifiedDate" TIMESTAMP(3),
    "email" TEXT NOT NULL,
    "emailVerifiedDate" TIMESTAMP(3),
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAuthentication" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "provider" "Provider" NOT NULL,
    "password_hash" TEXT,
    "accesstoken_token" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAuthentication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "AccountType" NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DECIMAL(10,2) NOT NULL,
    "description" TEXT,
    "type" "TransactionType" NOT NULL,
    "category" "TransactionCategory",
    "accountId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserAuthentication_userId_provider_key" ON "UserAuthentication"("userId", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "Account_userId_name_key" ON "Account"("userId", "name");

-- CreateIndex
CREATE INDEX "Transaction_userId_date_idx" ON "Transaction"("userId", "date");

-- CreateIndex
CREATE INDEX "Transaction_accountId_date_idx" ON "Transaction"("accountId", "date");

-- AddForeignKey
ALTER TABLE "UserAuthentication" ADD CONSTRAINT "UserAuthentication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
