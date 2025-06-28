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

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
