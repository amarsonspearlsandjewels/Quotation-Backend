const express = require('express');
const app = express();
const cors = require('cors');
const { db } = require('./firebase');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>APJ Jewellers - API Documentation</title>
      <style>
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }
          
          body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
          }
          
          .container {
              max-width: 1200px;
              margin: 0 auto;
              padding: 20px;
          }
          
          .header {
              background: rgba(255, 255, 255, 0.95);
              border-radius: 15px;
              padding: 30px;
              margin-bottom: 30px;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
              text-align: center;
          }
          
          .header h1 {
              color: #2c3e50;
              font-size: 2.5em;
              margin-bottom: 10px;
              background: linear-gradient(45deg, #667eea, #764ba2);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
          }
          
          .header p {
              color: #7f8c8d;
              font-size: 1.1em;
          }
          
          .api-section {
              background: rgba(255, 255, 255, 0.95);
              border-radius: 15px;
              padding: 30px;
              margin-bottom: 30px;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          }
          
          .section-title {
              color: #2c3e50;
              font-size: 1.8em;
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 3px solid #3498db;
          }
          
          .endpoint {
              background: #f8f9fa;
              border-radius: 10px;
              padding: 20px;
              margin-bottom: 20px;
              border-left: 5px solid #3498db;
          }
          
          .endpoint-header {
              display: flex;
              align-items: center;
              margin-bottom: 15px;
          }
          
          .method {
              background: #3498db;
              color: white;
              padding: 5px 15px;
              border-radius: 20px;
              font-weight: bold;
              margin-right: 15px;
              font-size: 0.9em;
          }
          
          .method.get { background: #27ae60; }
          .method.post { background: #e74c3c; }
          .method.put { background: #f39c12; }
          .method.delete { background: #e67e22; }
          
          .url {
              font-family: 'Courier New', monospace;
              background: #2c3e50;
              color: #ecf0f1;
              padding: 8px 15px;
              border-radius: 5px;
              font-size: 0.9em;
          }
          
          .description {
              color: #555;
              margin-bottom: 15px;
              font-size: 1em;
          }
          
          .params-section, .response-section, .error-section {
              margin-top: 15px;
          }
          
          .section-subtitle {
              color: #2c3e50;
              font-weight: bold;
              margin-bottom: 10px;
              font-size: 1.1em;
          }
          
          .param-table, .response-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
              background: white;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          
          .param-table th, .param-table td,
          .response-table th, .response-table td {
              padding: 12px;
              text-align: left;
              border-bottom: 1px solid #ddd;
          }
          
          .param-table th, .response-table th {
              background: #34495e;
              color: white;
              font-weight: bold;
          }
          
          .param-table tr:nth-child(even),
          .response-table tr:nth-child(even) {
              background: #f8f9fa;
          }
          
          .required {
              background: #e74c3c;
              color: white;
              padding: 2px 8px;
              border-radius: 10px;
              font-size: 0.8em;
          }
          
          .optional {
              background: #f39c12;
              color: white;
              padding: 2px 8px;
              border-radius: 10px;
              font-size: 0.8em;
          }
          
          .code-block {
              background: #2c3e50;
              color: #ecf0f1;
              padding: 15px;
              border-radius: 8px;
              font-family: 'Courier New', monospace;
              font-size: 0.9em;
              overflow-x: auto;
              margin: 10px 0;
          }
          
          .status-code {
              display: inline-block;
              padding: 3px 8px;
              border-radius: 5px;
              font-size: 0.8em;
              font-weight: bold;
              margin-right: 10px;
          }
          
          .status-200 { background: #27ae60; color: white; }
          .status-201 { background: #27ae60; color: white; }
          .status-400 { background: #e74c3c; color: white; }
          .status-401 { background: #e74c3c; color: white; }
          .status-404 { background: #e74c3c; color: white; }
          .status-409 { background: #f39c12; color: white; }
          .status-500 { background: #e67e22; color: white; }
          
          .example {
              background: #ecf0f1;
              border-left: 4px solid #3498db;
              padding: 15px;
              margin: 10px 0;
              border-radius: 0 8px 8px 0;
          }
          
          .example-title {
              font-weight: bold;
              color: #2c3e50;
              margin-bottom: 10px;
          }
          
          .toc {
              background: rgba(255, 255, 255, 0.95);
              border-radius: 15px;
              padding: 25px;
              margin-bottom: 30px;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          }
          
          .toc h2 {
              color: #2c3e50;
              margin-bottom: 15px;
          }
          
          .toc ul {
              list-style: none;
          }
          
          .toc li {
              margin: 8px 0;
          }
          
          .toc a {
              color: #3498db;
              text-decoration: none;
              font-weight: 500;
          }
          
          .toc a:hover {
              text-decoration: underline;
          }
          
          .info-box {
              background: #d1ecf1;
              border: 1px solid #bee5eb;
              border-radius: 8px;
              padding: 15px;
              margin: 15px 0;
          }
          
          .warning-box {
              background: #fff3cd;
              border: 1px solid #ffeaa7;
              border-radius: 8px;
              padding: 15px;
              margin: 15px 0;
          }
          
          .success-box {
              background: #d4edda;
              border: 1px solid #c3e6cb;
              border-radius: 8px;
              padding: 15px;
              margin: 15px 0;
          }
          
          @media (max-width: 768px) {
              .container {
                  padding: 10px;
              }
              
              .header h1 {
                  font-size: 2em;
              }
              
              .endpoint-header {
                  flex-direction: column;
                  align-items: flex-start;
              }
              
              .method {
                  margin-bottom: 10px;
              }
              
              .param-table, .response-table {
                  font-size: 0.9em;
              }
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>APJ Jewellers API Documentation</h1>
              <p>Comprehensive API documentation for Amarsons Pearls and Jewels management system</p>
              <p><strong>Base URL:</strong> https://apj-quotation-backend.vercel.app</p>
          </div>
  
          <div class="toc">
              <h2>Table of Contents</h2>
              <ul>
                  <li><a href="#authentication">🔐 Authentication</a></li>
                  <li><a href="#user-management">👥 User Management</a></li>
                  <li><a href="#pricing-management">💰 Pricing Management</a></li>
                  <li><a href="#item-management">📦 Item Management</a></li>
                  <li><a href="#draft-management">📝 Draft Management</a></li>
                  <li><a href="#items-used">💎 Items Used Management</a></li>
                  <li><a href="#error-handling">⚠️ Error Handling</a></li>
                  <li><a href="#status-codes">📊 Status Codes</a></li>
              </ul>
          </div>
  
          <div class="api-section" id="authentication">
              <h2 class="section-title">🔐 Authentication</h2>
              
              <div class="endpoint">
                  <div class="endpoint-header">
                      <span class="method get">GET</span>
                      <span class="url">/authenticate/username={username}/password={password}</span>
                  </div>
                  <div class="description">
                      Authenticates a user with username and password. Returns user information and admin status.
                  </div>
                  
                  <div class="params-section">
                      <div class="section-subtitle">Path Parameters</div>
                      <table class="param-table">
                          <thead>
                              <tr>
                                  <th>Parameter</th>
                                  <th>Type</th>
                                  <th>Required</th>
                                  <th>Description</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr>
                                  <td>username</td>
                                  <td>string</td>
                                  <td><span class="required">Required</span></td>
                                  <td>User's login username</td>
                              </tr>
                              <tr>
                                  <td>password</td>
                                  <td>string</td>
                                  <td><span class="required">Required</span></td>
                                  <td>User's login password</td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
  
                  <div class="response-section">
                      <div class="section-subtitle">Response</div>
                      
                      <div class="example">
                          <div class="example-title">Success Response (200)</div>
                          <div class="code-block">
  {
    "success": true,
    "message": "Authentication successful",
    "data": {
      "username": "admin",
      "isAdmin": true
    }
  }
                          </div>
                      </div>
  
                      <div class="example">
                          <div class="example-title">Error Response (401)</div>
                          <div class="code-block">
  {
    "success": false,
    "message": "Incorrect password"
  }
                          </div>
                      </div>
  
                      <div class="example">
                          <div class="example-title">Error Response (404)</div>
                          <div class="code-block">
  {
    "success": false,
    "message": "User 'username' not found"
  }
                          </div>
                      </div>
                  </div>
              </div>
          </div>
  
          <div class="api-section" id="user-management">
              <h2 class="section-title">👥 User Management</h2>
              
              <div class="endpoint">
                  <div class="endpoint-header">
                      <span class="method get">GET</span>
                      <span class="url">/addUser/username={username}/password={password}/admin={admin}</span>
                  </div>
                  <div class="description">
                      Creates a new user account with specified username, password, and admin privileges.
                  </div>
                  
                  <div class="params-section">
                      <div class="section-subtitle">Path Parameters</div>
                      <table class="param-table">
                          <thead>
                              <tr>
                                  <th>Parameter</th>
                                  <th>Type</th>
                                  <th>Required</th>
                                  <th>Description</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr>
                                  <td>username</td>
                                  <td>string</td>
                                  <td><span class="required">Required</span></td>
                                  <td>Unique username for the new account</td>
                              </tr>
                              <tr>
                                  <td>password</td>
                                  <td>string</td>
                                  <td><span class="required">Required</span></td>
                                  <td>Password for the new account</td>
                              </tr>
                              <tr>
                                  <td>admin</td>
                                  <td>boolean</td>
                                  <td><span class="required">Required</span></td>
                                  <td>Admin privileges (true/false)</td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
  
                  <div class="response-section">
                      <div class="section-subtitle">Response</div>
                      
                      <div class="example">
                          <div class="example-title">Success Response (201)</div>
                          <div class="code-block">
  {
    "success": true,
    "message": "User 'username' added successfully"
  }
                          </div>
                      </div>
  
                      <div class="example">
                          <div class="example-title">Error Response (409)</div>
                          <div class="code-block">
  {
    "success": false,
    "message": "User 'username' already exists"
  }
                          </div>
                      </div>
                  </div>
              </div>
  
              <div class="endpoint">
                  <div class="endpoint-header">
                      <span class="method get">GET</span>
                      <span class="url">/getAllUsers</span>
                  </div>
                  <div class="description">
                      Retrieves all users from the system with their details.
                  </div>
  
                  <div class="response-section">
                      <div class="section-subtitle">Response</div>
                      
                      <div class="example">
                          <div class="example-title">Success Response (200)</div>
                          <div class="code-block">
  {
    "success": true,
    "message": "5 users retrieved",
    "users": [
      {
        "docname": "admin",
        "USERNAME": "admin",
        "PASSWORD": "hashed_password",
        "ADMIN": true
      }
    ]
  }
                          </div>
                      </div>
                  </div>
              </div>
  
              <div class="endpoint">
                  <div class="endpoint-header">
                      <span class="method get">GET</span>
                      <span class="url">/editAdminAccess/username={username}/admin={admin}</span>
                  </div>
                  <div class="description">
                      Updates admin access privileges for a specific user.
                  </div>
  
                  <div class="response-section">
                      <div class="section-subtitle">Response</div>
                      
                      <div class="example">
                          <div class="example-title">Success Response (200)</div>
                          <div class="code-block">
  {
    "success": true,
    "message": "Admin access for 'username' updated to true"
  }
                          </div>
                      </div>
                  </div>
              </div>
  
              <div class="endpoint">
                  <div class="endpoint-header">
                      <span class="method get">GET</span>
                      <span class="url">/deleteUser/username={username}</span>
                  </div>
                  <div class="description">
                      Deletes a user account from the system.
                  </div>
  
                  <div class="response-section">
                      <div class="section-subtitle">Response</div>
                      
                      <div class="example">
                          <div class="example-title">Success Response (200)</div>
                          <div class="code-block">
  {
    "success": true,
    "message": "User 'username' deleted successfully"
  }
                          </div>
                      </div>
                  </div>
              </div>
          </div>
  
          <div class="api-section" id="pricing-management">
              <h2 class="section-title">💰 Pricing Management</h2>
              
              <div class="endpoint">
                  <div class="endpoint-header">
                      <span class="method get">GET</span>
                      <span class="url">/getGoldRates</span>
                  </div>
                  <div class="description">
                      Retrieves current gold rates for different purities (14k, 18k, 22k).
                  </div>
  
                  <div class="response-section">
                      <div class="section-subtitle">Response</div>
                      
                      <div class="example">
                          <div class="example-title">Success Response (200)</div>
                          <div class="code-block">
  {
    "14k": 4500,
    "18k": 5800,
    "22k": 7200
  }
                          </div>
                      </div>
                  </div>
              </div>
  
              <div class="endpoint">
                  <div class="endpoint-header">
                      <span class="method get">GET</span>
                      <span class="url">/getAllPrices</span>
                  </div>
                  <div class="description">
                      Retrieves all pricing data including gold rates, making charges, and wastage percentages.
                  </div>
  
                  <div class="response-section">
                      <div class="section-subtitle">Response</div>
                      
                      <div class="example">
                          <div class="example-title">Success Response (200)</div>
                          <div class="code-block">
  {
    "success": true,
    "message": "3 PRICES retrieved",
    "PRICES": [
      {
        "docname": "prices",
        "14k": 4500,
        "18k": 5800,
        "22k": 7200
      },
      {
        "docname": "making",
        "Gold Making": 500,
        "Diamond Making": 800,
        "Polki Making": 600,
        "Victorian Making": 700
      },
      {
        "docname": "wastage",
        "wastage": 2.5
      }
    ]
  }
                          </div>
                      </div>
                  </div>
              </div>
  
              <div class="endpoint">
                  <div class="endpoint-header">
                      <span class="method post">POST</span>
                      <span class="url">/updatePrices</span>
                  </div>
                  <div class="description">
                      Updates pricing data including gold rates, making charges, and wastage percentages.
                  </div>
  
                  <div class="params-section">
                      <div class="section-subtitle">Request Body</div>
                      <div class="code-block">
  {
    "PRICES": [
      {
        "docname": "prices",
        "14k": 4500,
        "18k": 5800,
        "22k": 7200
      },
      {
        "docname": "making",
        "Gold Making": 500,
        "Diamond Making": 800,
        "Polki Making": 600,
        "Victorian Making": 700
      },
      {
        "docname": "wastage",
        "wastage": 2.5
      }
    ]
  }
                      </div>
                  </div>
  
                  <div class="response-section">
                      <div class="section-subtitle">Response</div>
                      
                      <div class="example">
                          <div class="example-title">Success Response (200)</div>
                          <div class="code-block">
  {
    "success": true,
    "message": "3 PRICES updated successfully"
  }
                          </div>
                      </div>
                  </div>
              </div>
          </div>
  
          <div class="api-section" id="item-management">
              <h2 class="section-title">📦 Item Management</h2>
              
              <div class="endpoint">
                  <div class="endpoint-header">
                      <span class="method post">POST</span>
                      <span class="url">/addItem</span>
                  </div>
                  <div class="description">
                      Creates a new jewelry item with complete pricing calculations and specifications.
                  </div>
  
                  <div class="params-section">
                      <div class="section-subtitle">Request Body</div>
                      <table class="param-table">
                          <thead>
                              <tr>
                                  <th>Field</th>
                                  <th>Type</th>
                                  <th>Required</th>
                                  <th>Description</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr>
                                  <td>productId</td>
                                  <td>string</td>
                                  <td><span class="required">Required</span></td>
                                  <td>Unique product identifier</td>
                              </tr>
                              <tr>
                                  <td>category</td>
                                  <td>string</td>
                                  <td><span class="required">Required</span></td>
                                  <td>Jewelry category (GOLD, DIAMOND, POLKI, VICTORIAN)</td>
                              </tr>
                              <tr>
                                  <td>subcategory</td>
                                  <td>string</td>
                                  <td><span class="required">Required</span></td>
                                  <td>Jewelry type (Necklace, Ring, etc.)</td>
                              </tr>
                              <tr>
                                  <td>goldpurity</td>
                                  <td>string</td>
                                  <td><span class="required">Required</span></td>
                                  <td>Gold purity (14k, 18k, 22k)</td>
                              </tr>
                              <tr>
                                  <td>netweight</td>
                                  <td>number</td>
                                  <td><span class="required">Required</span></td>
                                  <td>Net weight in grams</td>
                              </tr>
                              <tr>
                                  <td>grossWeight</td>
                                  <td>number</td>
                                  <td><span class="required">Required</span></td>
                                  <td>Gross weight in grams</td>
                              </tr>
                              <tr>
                                  <td>totalprice</td>
                                  <td>number</td>
                                  <td><span class="required">Required</span></td>
                                  <td>Final calculated price</td>
                              </tr>
                              <tr>
                                  <td>itemsUsed</td>
                                  <td>array</td>
                                  <td><span class="required">Required</span></td>
                                  <td>Array of materials/stones used</td>
                              </tr>
                              <tr>
                                  <td>gst</td>
                                  <td>number</td>
                                  <td><span class="required">Required</span></td>
                                  <td>GST percentage</td>
                              </tr>
                              <tr>
                                  <td>imagelink</td>
                                  <td>string</td>
                                  <td><span class="required">Required</span></td>
                                  <td>URL to product image</td>
                              </tr>
                              <tr>
                                  <td>making</td>
                                  <td>number</td>
                                  <td><span class="optional">Optional</span></td>
                                  <td>Making type (0 for standard, 1 for Victorian)</td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
  
                  <div class="response-section">
                      <div class="section-subtitle">Response</div>
                      
                      <div class="example">
                          <div class="example-title">Success Response (200)</div>
                          <div class="code-block">
  {
    "success": true,
    "message": "Item GNS001 added successfully"
  }
                          </div>
                      </div>
  
                      <div class="example">
                          <div class="example-title">Error Response (400)</div>
                          <div class="code-block">
  {
    "success": false,
    "message": "Item with productId GNS001 already exists"
  }
                          </div>
                      </div>
                  </div>
              </div>
  
              <div class="endpoint">
                  <div class="endpoint-header">
                      <span class="method get">GET</span>
                      <span class="url">/getAllItems</span>
                  </div>
                  <div class="description">
                      Retrieves all jewelry items with automatic price verification and detailed breakdown calculations.
                  </div>
  
                  <div class="response-section">
                      <div class="section-subtitle">Response</div>
                      
                      <div class="example">
                          <div class="example-title">Success Response (200)</div>
                          <div class="code-block">
  {
    "success": true,
    "message": "Price verification completed and detailed item data returned.",
    "updatedCount": 2,
    "verifiedCount": 15,
    "items": [
      {
        "id": "GNS001",
        "productId": "GNS001",
        "category": "GOLD",
        "subcategory": "Necklace",
        "goldpurity": "18k",
        "netweight": 8.5,
        "grossWeight": 10.2,
        "finalPrice": 52000,
        "gst": 3,
        "imagelink": "https://example.com/image.jpg",
        "itemsUsed": [
          {
            "name": "Diamond",
            "unit": "ct",
            "quantity": 2.5,
            "price": 15000
          }
        ],
        "updated": false,
        "makingTypeUsed": 0,
        "totalStoneWeightCts": 2.5,
        "totalStoneWeightGms": 0.5,
        "totalStonePrice": 37500,
        "pricingBreakdown": {
          "goldCharges": 49300,
          "wastageCharges": 1232.5,
          "makingCharges": 4250,
          "materialCharges": 37500,
          "gstPercent": 3,
          "finalPrice": 52000
        }
      }
    ]
  }
                          </div>
                      </div>
                  </div>
              </div>
  
              <div class="endpoint">
                  <div class="endpoint-header">
                      <span class="method get">GET</span>
                      <span class="url">/deleteItem/productId={productId}</span>
                  </div>
                  <div class="description">
                      Deletes a jewelry item from the system by product ID.
                  </div>
  
                  <div class="response-section">
                      <div class="section-subtitle">Response</div>
                      
                      <div class="example">
                          <div class="example-title">Success Response (200)</div>
                          <div class="code-block">
  {
    "success": true,
    "message": "Item GNS001 successfully deleted"
  }
                          </div>
                      </div>
                  </div>
              </div>
          </div>
  
          <div class="api-section" id="draft-management">
              <h2 class="section-title">📝 Draft Management</h2>
              
              <div class="endpoint">
                  <div class="endpoint-header">
                      <span class="method post">POST</span>
                      <span class="url">/addDraft</span>
                  </div>
                  <div class="description">
                      Creates a draft jewelry item that can be reviewed and finalized later.
                  </div>
  
                  <div class="response-section">
                      <div class="section-subtitle">Response</div>
                      
                      <div class="example">
                          <div class="example-title">Success Response (200)</div>
                          <div class="code-block">
  {
    "success": true,
    "message": "Item GNS001 added successfully"
  }
                          </div>
                      </div>
                  </div>
              </div>
  
              <div class="endpoint">
                  <div class="endpoint-header">
                      <span class="method get">GET</span>
                      <span class="url">/getAllDrafts</span>
                  </div>
                  <div class="description">
                      Retrieves all draft items with price verification and calculations.
                  </div>
  
                  <div class="response-section">
                      <div class="section-subtitle">Response</div>
                      
                      <div class="example">
                          <div class="example-title">Success Response (200)</div>
                          <div class="code-block">
  {
    "success": true,
    "message": "Price verification completed and detailed item data returned.",
    "updatedCount": 1,
    "verifiedCount": 5,
    "items": [...]
  }
                          </div>
                      </div>
                  </div>
              </div>
  
              <div class="endpoint">
                  <div class="endpoint-header">
                      <span class="method get">GET</span>
                      <span class="url">/deleteDraft/productId={productId}</span>
                  </div>
                  <div class="description">
                      Deletes a draft item from the system.
                  </div>
  
                  <div class="response-section">
                      <div class="section-subtitle">Response</div>
                      
                      <div class="example">
                          <div class="example-title">Success Response (200)</div>
                          <div class="code-block">
  {
    "success": true,
    "message": "Item GNS001 successfully deleted"
  }
                          </div>
                      </div>
                  </div>
              </div>
          </div>
  
          <div class="api-section" id="items-used">
              <h2 class="section-title">💎 Items Used Management</h2>
              
              <div class="endpoint">
                  <div class="endpoint-header">
                      <span class="method get">GET</span>
                      <span class="url">/getItemsUsed</span>
                  </div>
                  <div class="description">
                      Retrieves all available materials and stones that can be used in jewelry items.
                  </div>
  
                  <div class="response-section">
                      <div class="section-subtitle">Response</div>
                      
                      <div class="example">
                          <div class="example-title">Success Response (200)</div>
                          <div class="code-block">
  {
    "success": true,
    "message": "8 items retrieved from FIXEDITEMS",
    "items": [
      {
        "name": "Diamond",
        "unit": "ct"
      },
      {
        "name": "Ruby",
        "unit": "ct"
      },
      {
        "name": "Emerald",
        "unit": "ct"
      }
    ]
  }
                          </div>
                      </div>
                  </div>
              </div>
  
              <div class="endpoint">
                  <div class="endpoint-header">
                      <span class="method post">POST</span>
                      <span class="url">/addItemsUsed</span>
                  </div>
                  <div class="description">
                      Updates the list of available materials and stones for jewelry items.
                  </div>
  
                  <div class="params-section">
                      <div class="section-subtitle">Request Body</div>
                      <div class="code-block">
  {
    "items": [
      {
        "name": "Diamond",
        "unit": "ct"
      },
      {
        "name": "Ruby",
        "unit": "ct"
      },
      {
        "name": "Gold Wire",
        "unit": "gms"
      }
    ]
  }
                      </div>
                  </div>
  
                  <div class="response-section">
                      <div class="section-subtitle">Response</div>
                      
                      <div class="example">
                          <div class="example-title">Success Response (200)</div>
                          <div class="code-block">
  {
    "success": true,
    "message": "Successfully updated FIXEDITEMS collection with 3 items",
    "itemsCount": 3
  }
                          </div>
                      </div>
                  </div>
              </div>
          </div>
  
          <div class="api-section" id="error-handling">
              <h2 class="section-title">⚠️ Error Handling</h2>
              
              <div class="info-box">
                  <strong>Error Response Format:</strong> All error responses follow a consistent format with a success flag set to false and a descriptive message.
              </div>
  
              <div class="warning-box">
                  <strong>Common Error Scenarios:</strong>
                  <ul>
                      <li>Missing required fields</li>
                      <li>Invalid data types</li>
                      <li>Duplicate entries</li>
                      <li>Resource not found</li>
                      <li>Authentication failures</li>
                      <li>Server errors</li>
                  </ul>
              </div>
  
              <div class="example">
                  <div class="example-title">Standard Error Response Format</div>
                  <div class="code-block">
  {
    "success": false,
    "message": "Descriptive error message",
    "error": "Detailed error information (optional)"
  }
                  </div>
              </div>
          </div>
  
          <div class="api-section" id="status-codes">
              <h2 class="section-title">📊 Status Codes</h2>
              
              <table class="response-table">
                  <thead>
                      <tr>
                          <th>Status Code</th>
                          <th>Description</th>
                          <th>Usage</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td><span class="status-code status-200">200</span></td>
                          <td>OK</td>
                          <td>Successful GET requests, updates, deletions</td>
                      </tr>
                      <tr>
                          <td><span class="status-code status-201">201</span></td>
                          <td>Created</td>
                          <td>Successful resource creation</td>
                      </tr>
                      <tr>
                          <td><span class="status-code status-400">400</span></td>
                          <td>Bad Request</td>
                          <td>Invalid request data, missing fields</td>
                      </tr>
                      <tr>
                          <td><span class="status-code status-401">401</span></td>
                          <td>Unauthorized</td>
                          <td>Authentication required or failed</td>
                      </tr>
                      <tr>
                          <td><span class="status-code status-404">404</span></td>
                          <td>Not Found</td>
                          <td>Resource not found</td>
                      </tr>
                      <tr>
                          <td><span class="status-code status-409">409</span></td>
                          <td>Conflict</td>
                          <td>Resource already exists</td>
                      </tr>
                      <tr>
                          <td><span class="status-code status-500">500</span></td>
                          <td>Internal Server Error</td>
                          <td>Server-side errors</td>
                      </tr>
                  </tbody>
              </table>
          </div>
  
          <div class="success-box">
              <strong>🎉 API Documentation Complete!</strong><br>
              This comprehensive documentation covers all endpoints, request/response formats, error handling, and status codes for the APJ Jewellers management system.
          </div>
      </div>
  </body>
  </html>
    `);
  
});

// AUTHENTICATE -- NO CHANGES REQUIRED [DONE]
app.get('/authenticate/username=:username/password=:password',
  async (req, res) => {
    const { username, password } = req.params;

    try {
      const userDocRef = db.collection('USERS').doc(username);
      const userDoc = await userDocRef.get();

      if (!userDoc.exists) {
        return res.status(404).json({
          success: false,
          message: `User '${username}' not found`,
        });
      }

      const userData = userDoc.data();

      if (userData.PASSWORD !== password) {
        return res.status(401).json({
          success: false,
          message: 'Incorrect password',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Authentication successful',
        data: {
          username: userData.USERNAME,
          isAdmin: userData.ADMIN,
        },
      });
    } catch (error) {
      console.error(`Authentication error for user '${username}':`, error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during authentication',
      });
    }
  }
);

// ADD USER - -- NO CHANGES REQUIRED [DONE]
app.get('/addUser/username=:username/password=:password/admin=:admin',
  async (req, res) => {
    const { username, password, admin } = req.params;

    if (!username || !password || typeof admin === 'undefined') {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: username, password, or admin',
      });
    }

    const isAdmin = admin === 'true';

    try {
      const userRef = db.collection('USERS').doc(username);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        return res.status(409).json({
          success: false,
          message: `User '${username}' already exists`,
        });
      }

      await userRef.set({
        USERNAME: username,
        PASSWORD: password,
        ADMIN: isAdmin,
      });

      return res.status(201).json({
        success: true,
        message: `User '${username}' added successfully`,
      });
    } catch (error) {
      console.error(`Error adding user '${username}':`, error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error while adding user',
      });
    }
  }
);

// ADD EDITED USER - -- NO CHANGES REQUIRED [DONE]
app.get('/addEditedUser/username=:username/password=:password/admin=:admin',
  async (req, res) => {
    const { username, password, admin } = req.params;

    const isAdmin = admin === 'true';

    try {
      const userRef = db.collection('USERS').doc(username);
      const userDoc = await userRef.get();

      await userRef.set({
        USERNAME: username,
        PASSWORD: password,
        ADMIN: isAdmin,
      });

      return res.status(201).json({
        success: true,
        message: `User '${username}' Edited successfully`,
      });
    } catch (error) {
      console.error(`Error adding user '${username}':`, error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error while adding user',
      });
    }
  }
);

// EDIT ADMIN ACCESS - -- NO CHANGES REQUIRED [DONE]
app.get('/editAdminAccess/username=:username/admin=:admin',
  async (req, res) => {
    const { username, admin } = req.params;

    if (!username || typeof admin === 'undefined') {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: username or admin',
      });
    }

    const isAdmin = admin === 'true';

    try {
      const userRef = db.collection('USERS').doc(username);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return res.status(404).json({
          success: false,
          message: `User '${username}' not found`,
        });
      }

      await userRef.update({ ADMIN: isAdmin });

      return res.status(200).json({
        success: true,
        message: `Admin access for '${username}' updated to ${isAdmin}`,
      });
    } catch (error) {
      console.error(`Error updating admin access for '${username}':`, error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error while updating admin access',
      });
    }
  }
);

// DELETE USER - -- NO CHANGES REQUIRED [DONE]
app.get('/deleteUser/username=:username', async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({
      success: false,
      message: 'Username is required to delete a user',
    });
  }

  try {
    const userRef = db.collection('USERS').doc(username);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: `User '${username}' not found`,
      });
    }

    await userRef.delete();

    return res.status(200).json({
      success: true,
      message: `User '${username}' deleted successfully`,
    });
  } catch (error) {
    console.error(`Error deleting user '${username}':`, error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while deleting user',
    });
  }
});

// GET ALL USERS - -- NO CHANGES REQUIRED [DONE]
app.get('/getAllUsers', async (req, res) => {
  try {
    const snapshot = await db.collection('USERS').get();

    const users = snapshot.docs.map((doc) => ({
      docname: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({
      success: true,
      message: `${users.length} users retrieved`,
      users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching users',
    });
  }
});


// GET GOLD RATES - -- NO CHANGES REQUIRED [DONE]
app.get('/getGoldRates', async (req, res) => {
  try {
    const pricesDoc = await db.collection('PRICES').doc('prices').get();

    if (!pricesDoc.exists) {
      return res.status(404).json({ error: 'Prices document not found' });
    }

    const data = pricesDoc.data();
    const result = {};

    // Only include 14k, 18k, 22k if present
    ['14k', '18k', '22k'].forEach((key) => {
      if (data[key] !== undefined) {
        result[key] = Number(data[key]);
      }
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching gold rates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// GET ALL PRICES FOR THE UPDATES SECTION -- NO CHANGES REQUIRED [DONE].
app.get('/getAllPrices', async (req, res) => {
  try {
    const snapshot = await db.collection('PRICES').get();

    const PRICES = snapshot.docs.map((doc) => ({
      docname: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({
      success: true,
      message: `${PRICES.length} PRICES retrieved`,
      PRICES,
    });
  } catch (error) {
    console.error('Error fetching PRICES:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching users',
    });
  }
});

// UPDATE PRICES - -- NO CHANGES REQUIRED [DONE]
app.post('/updatePrices', async (req, res) => {
  try {
    const updatedPrices = req.body.PRICES;

    if (!Array.isArray(updatedPrices) || updatedPrices.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or empty PRICES array in request body',
      });
    }

    const batch = db.batch();

    updatedPrices.forEach((priceDoc) => {
      const { docname, ...fields } = priceDoc;
      if (!docname) return;

      const docRef = db.collection('PRICES').doc(docname);
      batch.set(docRef, fields); // overwrite the document completely
    });

    await batch.commit();

    return res.status(200).json({
      success: true,
      message: `${updatedPrices.length} PRICES updated successfully`,
    });
  } catch (error) {
    console.error('Error updating PRICES:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while updating PRICES',
    });
  }
});

// DELETE ITEM - -- NO CHANGES REQUIRED [DONE]
app.get('/deleteItem/productId=:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId || typeof productId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Valid productId is required',
      });
    }

    const itemRef = db.collection('ITEMS').doc(productId);
    const doc = await itemRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: `Item with productId ${productId} does not exist`,
      });
    }

    await itemRef.delete();

    return res.status(200).json({
      success: true,
      message: `Item ${productId} successfully deleted`,
    });
  } catch (error) {
    console.error('Error in /deleteItem:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});

// DELETE DRAFT - -- NO CHANGES REQUIRED [DONE]
app.get('/deleteDraft/productId=:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId || typeof productId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Valid productId is required',
      });
    }

    const itemRef = db.collection('DRAFT').doc(productId);
    const doc = await itemRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: `Item with productId ${productId} does not exist`,
      });
    }

    await itemRef.delete();

    return res.status(200).json({
      success: true,
      message: `Item ${productId} successfully deleted`,
    });
  } catch (error) {
    console.error('Error in /deleteDraft:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});

// ADD ITEM - -- NO CHANGES REQUIRED [DONE]
app.post('/addItem', async (req, res) => {
  try {
    const itemData = req.body;

    // Validate required fields
    const requiredFields = [
      'productId',
      'category',
      'subcategory',
      'goldpurity',
      'netweight',
      'grossWeight',
      'totalprice',
      'itemsUsed',
      'gst',
      'imagelink',
    ];

    for (const field of requiredFields) {
      if (!itemData[field]) {
        return res.status(400).json({
          success: false,
          message: `Missing required field: ${field}`,
        });
      }
    }

    const { productId } = itemData;

    // Check if item with the same productId already exists
    const itemRef = db.collection('ITEMS').doc(productId);
    const existingDoc = await itemRef.get();

    if (existingDoc.exists) {
      return res.status(400).json({
        success: false,
        message: `Item with productId ${productId} already exists`,
      });
    }

    // Save the item to Firestore
    await itemRef.set({
      ...itemData,
      createdAt: new Date().toISOString(), // Optional metadata
    });

    return res.status(200).json({
      success: true,
      message: `Item ${productId} added successfully`,
    });
  } catch (error) {
    console.error('Error in /addItem:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});

// ADD EDITED ITEM - -- NO CHANGES REQUIRED [DONE]
app.post('/addeditedItem', async (req, res) => {
  try {
    const itemData = req.body;

    // Validate required fields
    const requiredFields = [
      'productId',
      'category',
      'subcategory',
      'goldpurity',
      'netweight',
      'grossWeight',
      'totalprice',
      'itemsUsed',
      'gst',
      'imagelink',
    ];

    for (const field of requiredFields) {
      if (!itemData[field]) {
        return res.status(400).json({
          success: false,
          message: `Missing required field: ${field}`,
        });
      }
    }

    const { productId } = itemData;

    // Check if item with the same productId already exists
    const itemRef = db.collection('ITEMS').doc(productId);
    const existingDoc = await itemRef.get();

    // Save the item to Firestore
    await itemRef.set({
      ...itemData,
      createdAt: new Date().toISOString(), // Optional metadata
    });

    return res.status(200).json({
      success: true,
      message: `Item ${productId} added successfully`,
    });
  } catch (error) {
    console.error('Error in /addItem:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});

// ADD DRAFT - -- NO CHANGES REQUIRED [DONE]
app.post('/addDraft', async (req, res) => {
  try {
    const itemData = req.body;

    // Validate required fields
    const requiredFields = [
      'productId',
      'category',
      'subcategory',
      'goldpurity',
      'netweight',
      'grossWeight',
      'totalprice',
      'itemsUsed',
      'gst',
      'imagelink',
    ];

    for (const field of requiredFields) {
      if (!itemData[field]) {
        return res.status(400).json({
          success: false,
          message: `Missing required field: ${field}`,
        });
      }
    }

    const { productId } = itemData;

    // Check if item with the same productId already exists
    const itemRef = db.collection('DRAFT').doc(productId);
    const existingDoc = await itemRef.get();

    if (existingDoc.exists) {
      return res.status(400).json({
        success: false,
        message: `Item with productId ${productId} already exists`,
      });
    }

    // Save the item to Firestore
    await itemRef.set({
      ...itemData,
      createdAt: new Date().toISOString(), // Optional metadata
    });

    return res.status(200).json({
      success: true,
      message: `Item ${productId} added successfully`,
    });
  } catch (error) {
    console.error('Error in /addItem:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});

// ADD EDITED DRAFT - -- NO CHANGES REQUIRED [DONE]
app.post('/addeditedDraft', async (req, res) => {
  try {
    const itemData = req.body;

    // Validate required fields
    const requiredFields = [
     'productId',
      'category',
      'subcategory',
      'goldpurity',
      'netweight',
      'grossWeight',
      'totalprice',
      'itemsUsed',
      'gst',
      'imagelink',
    ];

    for (const field of requiredFields) {
      if (!itemData[field]) {
        return res.status(400).json({
          success: false,
          message: `Missing required field: ${field}`,
        });
      }
    }

    const { productId } = itemData;

    // Check if item with the same productId already exists
    const itemRef = db.collection('DRAFT').doc(productId);
    const existingDoc = await itemRef.get();

    // Save the item to Firestore
    await itemRef.set({
      ...itemData,
      createdAt: new Date().toISOString(), // Optional metadata
    });

    return res.status(200).json({
      success: true,
      message: `Item ${productId} added successfully`,
    });
  } catch (error) {
    console.error('Error in /addDraft:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});

// app.get('/getAllItems', async (req, res) => {
//   try {
//     const [itemsSnapshot, pricesSnapshot] = await Promise.all([
//       db.collection('ITEMS').get(),
//       db.collection('PRICES').get(),
//     ]);

//     const prices = {};
//     pricesSnapshot.docs.forEach((doc) => {
//       prices[doc.id] = doc.data();
//     });

//     const updatedItems = [];

//     for (const doc of itemsSnapshot.docs) {
//       const item = { id: doc.id, ...doc.data() };

//       const {
//         category,
//         goldpurity,
//         netweight,
//         gst,
//         itemsUsed = [],
//         tier1price,
//         tier2price,
//         tier3price,
//         making,
//       } = item;

//       const netWeight = parseFloat(netweight);
//       const gstPercent = parseFloat(gst);
//       const tiers = [tier1price, tier2price, tier3price].map((p) =>
//         parseFloat(p)
//       );

//       const newTiers = [];
//       let totalStoneWeightCts = 0;
//       let totalStoneWeightGms = 0;
//       let totalStonePrice = 0;
//       let updated = false;
//       let makingTypeUsed = making;

//       // Arrays to hold detailed charges per tier
//       const goldCharges = [];
//       const wastageCharges = [];
//       const makingCharges = [];
//       const materialCharges = [];

//       console.log(`\n--- Processing item: ${item.id} ---`);
//       console.log(
//         `Category: ${category}, Gold Purity: ${goldpurity}, Net Weight: ${netWeight}g, GST: ${gstPercent}%`
//       );

//       for (let i = 0; i < 3; i++) {
//         // 1. Gold Base
//         const goldPrice = parseFloat(prices.GOLD[goldpurity][i]);
//         const goldBase = netWeight * goldPrice;
//         goldCharges[i] = goldBase;
//         console.log(
//           `Tier ${
//             i + 1
//           } - Gold base = ${netWeight} * ${goldPrice} = ${goldBase.toFixed(1)}`
//         );

//         // 2. Wastage (Gold only)
//         const wastagePercent = parseFloat(prices.GOLD.WASTAGE[i]);
//         const wastage = (wastagePercent / 100) * goldBase;
//         wastageCharges[i] = wastage;
//         console.log(`Wastage (${wastagePercent}%) = ${wastage.toFixed(1)}`);

//         // 3. Making Charges
//         let makingc = 0;
//         let makingOptions = [];

//         if (category === 'POLKI') {
//           const making1 = netWeight * parseFloat(prices.POLKI.POLKIMC[i]);
//           const making2 = netWeight * parseFloat(prices.POLKI.VICTORIANMC[i]);
//           makingOptions = [
//             { type: 'POLKIMC', value: making1 },
//             { type: 'VICTORIANMC', value: making2 },
//           ];
//           // We'll pick the matching one below
//         } else {
//           makingc = netWeight * parseFloat(prices[category]?.MAKING?.[i] || 0);
//           makingCharges[i] = makingc;
//           console.log(
//             `Making (${
//               prices[category]?.MAKING?.[i]
//             } per g) = ${makingc.toFixed(1)}`
//           );
//         }

//         // 4. Materials Used
//         let materialTotal = 0;
//         for (const mat of itemsUsed) {
//           const matCategory = prices[mat.category];
//           if (!matCategory || !matCategory[mat.label]) continue;

//           const quantity = parseFloat(mat.quantity);
//           const unitPrice = parseFloat(matCategory[mat.label][i]);
//           const matPrice = quantity * unitPrice;
//           materialTotal += matPrice;
//           totalStonePrice += matPrice;

//           totalStoneWeightCts += quantity;
//           totalStoneWeightGms += quantity * 0.2;

//           console.log(
//             `Material: ${
//               mat.label
//             } x ${quantity} @ ${unitPrice} = ${matPrice.toFixed(1)}`
//           );
//         }
//         materialCharges[i] = materialTotal;

//         // 5. Final Price Calculation
//         let calculatedPrice;

//         if (category === 'POLKI') {
//           let matched = false;
//           for (const opt of makingOptions) {
//             const subtotal = goldBase + wastage + opt.value + materialTotal;
//             const final = parseFloat(
//               (subtotal * (1 + gstPercent / 100)).toFixed(1)
//             );
//             console.log(
//               `POLKI ${opt.type} Total = (${subtotal.toFixed(
//                 1
//               )} + GST) = ${final}`
//             );

//             if (final === tiers[i]) {
//               calculatedPrice = final;
//               makingTypeUsed = making;
//               makingCharges[i] = opt.value;
//               matched = true;
//               console.log(`✅ Tier ${i + 1} matches with ${opt.type}`);
//               break;
//             }
//           }

//           if (!matched) {
//             const subtotal =
//               goldBase + wastage + makingOptions[0].value + materialTotal;
//             calculatedPrice = parseFloat(
//               (subtotal * (1 + gstPercent / 100)).toFixed(1)
//             );
//             makingCharges[i] = makingOptions[0].value;
//             updated = true;
//             console.log(
//               `❌ Tier ${
//                 i + 1
//               } mismatch. Setting MAKING variant: ${calculatedPrice}`
//             );
//           }
//         } else {
//           const subtotal = goldBase + wastage + makingc + materialTotal;
//           calculatedPrice = parseFloat(
//             (subtotal * (1 + gstPercent / 100)).toFixed(1)
//           );

//           if (calculatedPrice !== tiers[i]) {
//             updated = true;
//             console.log(
//               `❌ Tier ${i + 1} mismatch: stored=${
//                 tiers[i]
//               }, calculated=${calculatedPrice}`
//             );
//           } else {
//             console.log(`✅ Tier ${i + 1} verified`);
//           }
//         }

//         newTiers[i] = calculatedPrice;
//       }

//       // Update Firebase if needed
//       if (updated) {
//         await db.collection('ITEMS').doc(item.id).update({
//           tier1price: newTiers[0],
//           tier2price: newTiers[1],
//           tier3price: newTiers[2],
//         });
//         console.log(`🔁 Updated item ${item.id} with corrected prices.`);
//       } else {
//         console.log(`✅ No update needed for item ${item.id}`);
//       }

//       updatedItems.push({
//         ...item,
//         updated,
//         tier1price: newTiers[0],
//         tier2price: newTiers[1],
//         tier3price: newTiers[2],
//         makingTypeUsed,
//         making,
//         totalStoneWeightCts: parseFloat(totalStoneWeightCts.toFixed(2)),
//         totalStoneWeightGms: parseFloat(totalStoneWeightGms.toFixed(2)),
//         totalStonePrice: parseFloat(totalStonePrice.toFixed(1)),

//         // Add detailed breakdown per tier:
//         pricingBreakdown: {
//           tier1: {
//             goldCharges: parseFloat(goldCharges[0].toFixed(1)),
//             wastageCharges: parseFloat(wastageCharges[0].toFixed(1)),
//             makingCharges: parseFloat(makingCharges[0].toFixed(1)),
//             materialCharges: parseFloat(materialCharges[0].toFixed(1)),
//             gstPercent,
//             finalPrice: newTiers[0],
//           },
//           tier2: {
//             goldCharges: parseFloat(goldCharges[1].toFixed(1)),
//             wastageCharges: parseFloat(wastageCharges[1].toFixed(1)),
//             makingCharges: parseFloat(makingCharges[1].toFixed(1)),
//             materialCharges: parseFloat(materialCharges[1].toFixed(1)),
//             gstPercent,
//             finalPrice: newTiers[1],
//           },
//           tier3: {
//             goldCharges: parseFloat(goldCharges[2].toFixed(1)),
//             wastageCharges: parseFloat(wastageCharges[2].toFixed(1)),
//             makingCharges: parseFloat(makingCharges[2].toFixed(1)),
//             materialCharges: parseFloat(materialCharges[2].toFixed(1)),
//             gstPercent,
//             finalPrice: newTiers[2],
//           },
//         },
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: 'Price verification completed and detailed item data returned.',
//       updatedCount: updatedItems.filter((i) => i.updated).length,
//       verifiedCount: updatedItems.filter((i) => !i.updated).length,
//       items: updatedItems,
//     });
//   } catch (error) {
//     console.error('Error in /getAllItems:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Internal server error during item verification',
//       error: error.message,
//     });
//   }
// });

//


// ADD ITEMS - -- NO CHANGES REQUIRED [DONE]
app.get('/getAllItems', async (req, res) => {
  try {
    const [itemsSnapshot, pricesSnapshot] = await Promise.all([
      db.collection('ITEMS').get(),
      db.collection('PRICES').get(),
    ]);

    const prices = {};
    pricesSnapshot.docs.forEach((doc) => {
      prices[doc.id] = doc.data(); // Use document ID as key
    });

    const updatedItems = [];

    for (const doc of itemsSnapshot.docs) {
      const item = { id: doc.id, ...doc.data() };

      const {
        category,
        goldpurity,
        grossWeight,
        gst,
        itemsUsed = [],
        finalPrice,
        making,
      } = item;

      const gross = parseFloat(grossWeight);
      const gstPercent = parseFloat(gst);
      const storedPrice = parseFloat(finalPrice);
      let updated = false;

      // 1. Process itemsUsed to compute stone weight and material price
      let materialTotal = 0;
      let totalStoneWeightCts = 0;
      let totalStoneWeightGms = 0;
      let totalStonePrice = 0;

      for (const mat of itemsUsed) {
        const quantity = parseFloat(mat.quantity);
        const price = parseFloat(mat.price || 0);
        const unit = (mat.unit || 'ct').toLowerCase();

        // If unit is gram/gms, use quantity directly as grams
        // If unit is carat/ct, convert to grams (0.2g per carat)
        const weightInGms = unit === 'gram' || unit === 'gms' ? quantity : quantity * 0.2;
        const matPrice = quantity * price;

        materialTotal += matPrice;
        totalStonePrice += matPrice;
        if (unit === 'ct') totalStoneWeightCts += quantity;
        totalStoneWeightGms += weightInGms;
      }

      // --- MATCH FRONTEND LOGIC ---
      // 2. Net weight (after stone deduction, before wastage)
      const netWeight = gross - totalStoneWeightGms;
      // 3. Gold price
      const goldPrice = parseFloat(prices.prices[goldpurity]);
      const goldAmt = goldPrice * netWeight;
      // 4. Wastage amount (as percent of gold amount)
      const wastagePercent = parseFloat(prices.wastage.wastage);
      const wastageAmt = (wastagePercent / 100) * goldAmt;
      // 5. Making charges
      let makingCharge = 0;
      let makingTypeUsed = making;
      if (category === 'POLKI') {
        const polki = netWeight * prices.making['Polki Making'];
        const victorian = netWeight * prices.making['Victorian Making'];
        makingCharge = polki;
      } else if (category === 'VICTORIAN') {
        makingCharge = netWeight * prices.making['Victorian Making'];
      } else if (category === 'DIAMOND') {
        makingCharge = netWeight * prices.making['Diamond Making'];
      } else {
        makingCharge = netWeight * prices.making['Gold Making'];
      }
      // 6. Subtotal and GST
      const subtotal = goldAmt + wastageAmt + makingCharge + materialTotal;
      const calculatedPrice = parseFloat((subtotal * (1 + gstPercent / 100)).toFixed(1));

      if (calculatedPrice !== storedPrice) {
        updated = true;
        await db.collection('ITEMS').doc(item.id).update({
          finalPrice: calculatedPrice,
          netweight: parseFloat(netWeight.toFixed(2)),
        });
      }

      // 7. Prepare response
      updatedItems.push({
        ...item,
        updated,
        finalPrice: calculatedPrice,
        netweight: parseFloat(netWeight.toFixed(2)),
        makingTypeUsed,
        totalStoneWeightCts: parseFloat(totalStoneWeightCts.toFixed(2)),
        totalStoneWeightGms: parseFloat(totalStoneWeightGms.toFixed(2)),
        totalStonePrice: parseFloat(materialTotal.toFixed(1)),
        pricingBreakdown: {
          goldCharges: parseFloat(goldAmt.toFixed(1)),
          wastageCharges: parseFloat(wastageAmt.toFixed(1)),
          makingCharges: parseFloat(makingCharge.toFixed(1)),
          materialCharges: parseFloat(materialTotal.toFixed(1)),
          gstPercent,
          finalPrice: calculatedPrice,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Price verification completed and detailed item data returned.',
      updatedCount: updatedItems.filter((i) => i.updated).length,
      verifiedCount: updatedItems.filter((i) => !i.updated).length,
      items: updatedItems,
    });
  } catch (error) {
    console.error('Error in /getAllItems:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during item verification',
      error: error.message,
    });
  }
});

// GET DRAFTS - -- NO CHANGES REQUIRED [DONE]
app.get('/getAllDrafts', async (req, res) => {
  try {
    const [itemsSnapshot, pricesSnapshot] = await Promise.all([
      db.collection('DRAFT').get(),
      db.collection('PRICES').get(),
    ]);

    const prices = {};
    pricesSnapshot.docs.forEach((doc) => {
      prices[doc.id] = doc.data(); // Use document ID as key
    });

    const updatedItems = [];

    for (const doc of itemsSnapshot.docs) {
      const item = { id: doc.id, ...doc.data() };

      const {
        category,
        goldpurity,
        grossWeight,
        gst,
        itemsUsed = [],
        finalPrice,
        making,
      } = item;

      const gross = parseFloat(grossWeight);
      const gstPercent = parseFloat(gst);
      const storedPrice = parseFloat(finalPrice);
      let updated = false;

      // 1. Process itemsUsed to compute stone weight and material price
      let materialTotal = 0;
      let totalStoneWeightCts = 0;
      let totalStoneWeightGms = 0;
      let totalStonePrice = 0;

      for (const mat of itemsUsed) {
        const quantity = parseFloat(mat.quantity);
        const price = parseFloat(mat.price || 0);
        const unit = (mat.unit || 'ct').toLowerCase();

        // If unit is gram/gms, use quantity directly as grams
        // If unit is carat/ct, convert to grams (0.2g per carat)
        const weightInGms = unit === 'gram' || unit === 'gms' ? quantity : quantity * 0.2;
        const matPrice = quantity * price;

        materialTotal += matPrice;
        totalStonePrice += matPrice;
        if (unit === 'ct') totalStoneWeightCts += quantity;
        totalStoneWeightGms += weightInGms;
      }

      // --- MATCH FRONTEND LOGIC ---
      // 2. Net weight (after stone deduction, before wastage)
      const netWeight = gross - totalStoneWeightGms;
      // 3. Gold price
      const goldPrice = parseFloat(prices.prices[goldpurity]);
      const goldAmt = goldPrice * netWeight;
      // 4. Wastage amount (as percent of gold amount)
      const wastagePercent = parseFloat(prices.wastage.wastage);
      const wastageAmt = (wastagePercent / 100) * goldAmt;
      // 5. Making charges
      let makingCharge = 0;
      let makingTypeUsed = making;
      if (category === 'POLKI') {
        const polki = netWeight * prices.making['Polki Making'];
        const victorian = netWeight * prices.making['Victorian Making'];
        makingCharge = polki;
      } else if (category === 'VICTORIAN') {
        makingCharge = netWeight * prices.making['Victorian Making'];
      } else if (category === 'DIAMOND') {
        makingCharge = netWeight * prices.making['Diamond Making'];
      } else {
        makingCharge = netWeight * prices.making['Gold Making'];
      }
      // 6. Subtotal and GST
      const subtotal = goldAmt + wastageAmt + makingCharge + materialTotal;
      const calculatedPrice = parseFloat((subtotal * (1 + gstPercent / 100)).toFixed(1));

      if (calculatedPrice !== storedPrice) {
        updated = true;
        await db.collection('DRAFT').doc(item.id).update({
          finalPrice: calculatedPrice,
          netweight: parseFloat(netWeight.toFixed(2)),
        });
      }

      // 7. Prepare response
      updatedItems.push({
        ...item,
        updated,
        finalPrice: calculatedPrice,
        netweight: parseFloat(netWeight.toFixed(2)),
        makingTypeUsed,
        totalStoneWeightCts: parseFloat(totalStoneWeightCts.toFixed(2)),
        totalStoneWeightGms: parseFloat(totalStoneWeightGms.toFixed(2)),
        totalStonePrice: parseFloat(materialTotal.toFixed(1)),
        pricingBreakdown: {
          goldCharges: parseFloat(goldAmt.toFixed(1)),
          wastageCharges: parseFloat(wastageAmt.toFixed(1)),
          makingCharges: parseFloat(makingCharge.toFixed(1)),
          materialCharges: parseFloat(materialTotal.toFixed(1)),
          gstPercent,
          finalPrice: calculatedPrice,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Price verification completed and detailed item data returned.',
      updatedCount: updatedItems.filter((i) => i.updated).length,
      verifiedCount: updatedItems.filter((i) => !i.updated).length,
      items: updatedItems,
    });
  } catch (error) {
    console.error('Error in /getAllDrafts:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during item verification',
      error: error.message,
    });
  }
});

// GET ITEMS USED - -- NO CHANGES REQUIRED [DONE]
app.get('/getItemsUsed', async (req, res) => {
  try {
    const snapshot = await db.collection('FIXEDITEMS').get();

    const items = snapshot.docs.map((doc) => doc.data());

    return res.status(200).json({
      success: true,
      message: `${items.length} items retrieved from FIXEDITEMS`,
      items: items,
    });
  } catch (error) {
    console.error('Error fetching items from FIXEDITEMS:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching items',
      error: error.message,
    });
  }
});

// ADD ITEMS USED - -- NO CHANGES REQUIRED [DONE]
app.post('/addItemsUsed', async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Request body must contain an "items" array',
      });
    }

    // Validate each item has a name and a valid unit
    for (const item of items) {
      if (!item.name || !item.unit || !['ct', 'gms'].includes(item.unit)) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have a name and a unit (ct or gms)',
        });
      }
    }

    // Clear the existing collection
    const existingDocs = await db.collection('FIXEDITEMS').get();
    const batch = db.batch();
    
    existingDocs.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Add new items to the collection
    items.forEach((item, index) => {
      const docRef = db.collection('FIXEDITEMS').doc(`item_${index}`);
      batch.set(docRef, item);
    });

    await batch.commit();

    return res.status(200).json({
      success: true,
      message: `Successfully updated FIXEDITEMS collection with ${items.length} items`,
      itemsCount: items.length,
    });
  } catch (error) {
    console.error('Error updating FIXEDITEMS collection:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while updating items',
      error: error.message,
    });
  }
});



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
