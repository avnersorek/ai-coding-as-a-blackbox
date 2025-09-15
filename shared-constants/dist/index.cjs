"use strict";
/**
 * Shared constants for the AI Coding application
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FRONTEND_BASE_URL = exports.FRONTEND_BASE_ROUTE = exports.FRONTEND_HOST = void 0;
/**
 * Frontend host URL for the application
 */
exports.FRONTEND_HOST = 'http://localhost:8080';
/**
 * Base route path for GitHub Pages deployment
 */
exports.FRONTEND_BASE_ROUTE = '/ai-coding-as-a-blackbox/';
/**
 * Full frontend URL combining host and base route
 */
exports.FRONTEND_BASE_URL = exports.FRONTEND_HOST + exports.FRONTEND_BASE_ROUTE;