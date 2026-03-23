// Compliance routes - Privacy, GDPR, Data Management
import express from 'express';
import { supabase } from '../server.js';
import { verifyJWT } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// GET /api/compliance/privacy-policy
router.get('/privacy-policy', (req, res) => {
  const privacyPolicy = {
    title: 'Privacy Policy',
    lastUpdated: '2026-03-23',
    version: '1.0.0',
    content: `
# Privacy Policy

## 1. Introduction
MemoryLayer ("we", "us", "our") operates the MemoryLayer service. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our service.

## 2. Information Collection and Use
We collect several different types of information for various purposes to provide and improve our service to you.

### Types of Data Collected:
- **Account Data**: Email, name, password hash
- **Memory Data**: Content you save, project information, preferences
- **Usage Data**: How you interact with the service, timestamps, IP addresses
- **Device Data**: Browser type, operating system, device information

## 3. Use of Data
MemoryLayer uses the collected data for various purposes:
- To provide and maintain our service
- To notify you about changes to our service
- To allow you to participate in interactive features
- To provide customer support
- To gather analysis or valuable information
- To monitor the usage of our service
- To detect, prevent and address technical issues

## 4. Security of Data
The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure.

We use:
- Encryption at rest (AES-256)
- Encryption in transit (HTTPS/TLS)
- Bcrypt password hashing
- Row-level security in database
- Regular security audits

## 5. Your Rights
You have the right to:
- Access your personal data
- Correct inaccurate data
- Request deletion of your data
- Export your data
- Withdraw consent

## 6. Contact Us
If you have any questions about this Privacy Policy, please contact us at privacy@memorylayer.com
    `,
  };

  res.json(privacyPolicy);
});

// GET /api/compliance/terms-of-service
router.get('/terms-of-service', (req, res) => {
  const tos = {
    title: 'Terms of Service',
    lastUpdated: '2026-03-23',
    version: '1.0.0',
    content: `
# Terms of Service

## 1. Acceptance of Terms
By accessing and using MemoryLayer, you accept and agree to be bound by the terms and provision of this agreement.

## 2. Use License
Permission is granted to temporarily download one copy of the materials (information or software) on MemoryLayer for personal, non-commercial transitory viewing only.

## 3. Disclaimer
The materials on MemoryLayer are provided on an 'as is' basis. MemoryLayer makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.

## 4. Limitations
In no event shall MemoryLayer or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on MemoryLayer.

## 5. Accuracy of Materials
The materials appearing on MemoryLayer could include technical, typographical, or photographic errors. MemoryLayer does not warrant that any of the materials on MemoryLayer are accurate, complete, or current.

## 6. Links
MemoryLayer has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by MemoryLayer of the site. Use of any such linked website is at the user's own risk.

## 7. Modifications
MemoryLayer may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.

## 8. Governing Law
These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction where MemoryLayer is located, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
    `,
  };

  res.json(tos);
});

// POST /api/compliance/data-export - Export all user data (GDPR)
router.post('/data-export', verifyJWT, async (req, res, next) => {
  try {
    const { id: user_id } = req.user;

    logger.info('Data export requested', { user_id });

    // Get user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, name, created_at')
      .eq('id', user_id)
      .single();

    if (userError) throw userError;

    // Get all memories
    const { data: memories, error: memoriesError } = await supabase
      .from('memories')
      .select('*')
      .eq('user_id', user_id);

    if (memoriesError) throw memoriesError;

    const exportData = {
      exportDate: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.created_at,
      },
      memories: memories || [],
      statistics: {
        totalMemories: memories?.length || 0,
        accountAge: Math.floor((Date.now() - new Date(user.created_at)) / (1000 * 60 * 60 * 24)) + ' days',
      },
    };

    logger.info('Data export completed', { user_id, memoriesCount: memories?.length || 0 });

    res.json({
      success: true,
      data: exportData,
      message: 'Your data has been exported successfully',
    });
  } catch (error) {
    logger.error('Data export error', { error: error.message });
    next(error);
  }
});

// POST /api/compliance/data-deletion - Delete all user data (GDPR)
router.post('/data-deletion', verifyJWT, async (req, res, next) => {
  try {
    const { id: user_id } = req.user;
    const { confirmDeletion } = req.body;

    if (!confirmDeletion) {
      return res.status(400).json({
        error: {
          message: 'Please confirm data deletion by setting confirmDeletion to true',
          code: 'CONFIRMATION_REQUIRED',
        },
      });
    }

    logger.warn('Data deletion initiated', { user_id });

    // Delete all memories
    const { error: memoriesError } = await supabase
      .from('memories')
      .delete()
      .eq('user_id', user_id);

    if (memoriesError) throw memoriesError;

    // Delete user account
    const { error: userError } = await supabase
      .from('users')
      .delete()
      .eq('id', user_id);

    if (userError) throw userError;

    logger.warn('User account deleted', { user_id });

    res.json({
      success: true,
      message: 'Your account and all associated data have been permanently deleted',
      deletedAt: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Data deletion error', { error: error.message });
    next(error);
  }
});

// GET /api/compliance/consent-status - Get user consent status
router.get('/consent-status', verifyJWT, async (req, res, next) => {
  try {
    const { id: user_id } = req.user;

    // In production, this would query a consent table
    const consentStatus = {
      user_id,
      analytics: true,
      marketing: false,
      thirdParty: false,
      lastUpdated: new Date().toISOString(),
    };

    res.json({
      success: true,
      consent: consentStatus,
    });
  } catch (error) {
    logger.error('Consent status error', { error: error.message });
    next(error);
  }
});

// POST /api/compliance/consent-update - Update consent preferences
router.post('/consent-update', verifyJWT, async (req, res, next) => {
  try {
    const { id: user_id } = req.user;
    const { analytics, marketing, thirdParty } = req.body;

    logger.info('Consent preferences updated', {
      user_id,
      analytics,
      marketing,
      thirdParty,
    });

    // In production, this would update a consent table
    const updatedConsent = {
      user_id,
      analytics: analytics !== undefined ? analytics : true,
      marketing: marketing !== undefined ? marketing : false,
      thirdParty: thirdParty !== undefined ? thirdParty : false,
      lastUpdated: new Date().toISOString(),
    };

    res.json({
      success: true,
      message: 'Consent preferences updated',
      consent: updatedConsent,
    });
  } catch (error) {
    logger.error('Consent update error', { error: error.message });
    next(error);
  }
});

export default router;
