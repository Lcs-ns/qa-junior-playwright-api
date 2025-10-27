import { defineConfig, PlaywrightTestConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

const token = process.env.PRIMARY_TOKEN;

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  use: {
    baseURL: process.env.BASE_URL,
    extraHTTPHeaders: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  },
  reporter: [['list'], ['html', { open: 'never' }]]
});
