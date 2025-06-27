const express = require('express');
const app = express();
const cors = require('cors');
const { db } = require('./firebase');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
  res.send('Amarsons Pearls and Jewels');
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
      const netWeightBeforeWastage = gross - totalStoneWeightGms;
      // 3. Wastage (as percent of net weight)
      const wastagePercent = parseFloat(prices.wastage.wastage);
      const wastage = (wastagePercent / 100) * netWeightBeforeWastage;
      // 4. Final netWeight = metal part only
      const netWeightFinal = netWeightBeforeWastage - wastage;
      // 5. Gold price
      const goldPrice = parseFloat(prices.prices[goldpurity]);
      const goldAmt = goldPrice * netWeightFinal;
      // 6. Making charges - FIXED LOGIC
      let makingCharge = 0;
      if (category === 'POLKI') {
        makingCharge = netWeightFinal * parseFloat(prices.making['Polki Making'] || 0);
      } else if (category === 'VICTORIAN') {
        makingCharge = netWeightFinal * parseFloat(prices.making['Victorian Making'] || 0);
      } else if (category === 'DIAMOND') {
        makingCharge = netWeightFinal * parseFloat(prices.making['Diamond Making'] || 0);
      } else {
        makingCharge = netWeightFinal * parseFloat(prices.making['Gold Making'] || 0);
      }
      // 7. Subtotal and GST
      const subtotal = goldAmt + wastage * goldPrice + makingCharge + materialTotal;
      const calculatedPrice = parseFloat((subtotal * (1 + gstPercent / 100)).toFixed(1));

      if (calculatedPrice !== storedPrice) {
        updated = true;
        await db.collection('ITEMS').doc(item.id).update({
          finalPrice: calculatedPrice,
          netweight: parseFloat(netWeightFinal.toFixed(2)),
        });
      }

      // 8. Prepare response
      updatedItems.push({
        ...item,
        updated,
        finalPrice: calculatedPrice,
        netweight: parseFloat(netWeightFinal.toFixed(2)),
        makingTypeUsed: making,
        totalStoneWeightCts: parseFloat(totalStoneWeightCts.toFixed(2)),
        totalStoneWeightGms: parseFloat(totalStoneWeightGms.toFixed(2)),
        totalStonePrice: parseFloat(materialTotal.toFixed(1)),
        pricingBreakdown: {
          goldCharges: parseFloat(goldAmt.toFixed(1)),
          wastageCharges: parseFloat((wastage * goldPrice).toFixed(1)),
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
      const netWeightBeforeWastage = gross - totalStoneWeightGms;
      // 3. Wastage (as percent of net weight)
      const wastagePercent = parseFloat(prices.wastage.wastage);
      const wastage = (wastagePercent / 100) * netWeightBeforeWastage;
      // 4. Final netWeight = metal part only
      const netWeightFinal = netWeightBeforeWastage - wastage;
      // 5. Gold price
      const goldPrice = parseFloat(prices.prices[goldpurity]);
      const goldAmt = goldPrice * netWeightFinal;
      // 6. Making charges - FIXED LOGIC
      let makingCharge = 0;
      if (category === 'POLKI') {
        makingCharge = netWeightFinal * parseFloat(prices.making['Polki Making'] || 0);
      } else if (category === 'VICTORIAN') {
        makingCharge = netWeightFinal * parseFloat(prices.making['Victorian Making'] || 0);
      } else if (category === 'DIAMOND') {
        makingCharge = netWeightFinal * parseFloat(prices.making['Diamond Making'] || 0);
      } else {
        makingCharge = netWeightFinal * parseFloat(prices.making['Gold Making'] || 0);
      }
      // 7. Subtotal and GST
      const subtotal = goldAmt + wastage * goldPrice + makingCharge + materialTotal;
      const calculatedPrice = parseFloat((subtotal * (1 + gstPercent / 100)).toFixed(1));

      if (calculatedPrice !== storedPrice) {
        updated = true;
        await db.collection('DRAFT').doc(item.id).update({
          finalPrice: calculatedPrice,
          netweight: parseFloat(netWeightFinal.toFixed(2)),
        });
      }

      // 8. Prepare response
      updatedItems.push({
        ...item,
        updated,
        finalPrice: calculatedPrice,
        netweight: parseFloat(netWeightFinal.toFixed(2)),
        makingTypeUsed: making,
        totalStoneWeightCts: parseFloat(totalStoneWeightCts.toFixed(2)),
        totalStoneWeightGms: parseFloat(totalStoneWeightGms.toFixed(2)),
        totalStonePrice: parseFloat(materialTotal.toFixed(1)),
        pricingBreakdown: {
          goldCharges: parseFloat(goldAmt.toFixed(1)),
          wastageCharges: parseFloat((wastage * goldPrice).toFixed(1)),
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
