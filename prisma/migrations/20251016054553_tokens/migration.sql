-- CreateTable
CREATE TABLE "tokens" (
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "tokens_token_key" ON "tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_user_id_user_agent_key" ON "tokens"("user_id", "user_agent");

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
