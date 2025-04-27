// import { fileURLToPath } from 'url';
// import nodemailer from 'nodemailer';
// import path from 'path';
// import { EMAIL_PASSWORD, EMAIL_USERNAME } from '../config/index';
// import hbs from 'nodemailer-express-handlebars';
// import { AppError } from '../utils/index';
// import { RESOURCE_NAMES } from '../constants';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Set up transporter
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: EMAIL_USERNAME,
//         pass: EMAIL_PASSWORD,  // App Password
//     },
// });

// // Configure Handlebars template engine
// transporter.use('compile', hbs({
//     viewEngine: {
//         extName: ".html",
//         partialsDir: path.join(__dirname, '../utils/emailTemplates'),
//         defaultLayout: false,
//     },
//     viewPath: path.join(__dirname, '../utils/emailTemplates'),
//     extName: ".html",
// }));

// // Resource mapping
// const resourceMap = {
//     freeTemplate: {
//         fileName: RESOURCE_NAMES.freeTemplate,
//         filePath: path.resolve(__dirname, '../public/freeTemplate.pdf'),
//         subject: "Your Free Proposal Template is Here!",
//         message: "Here is your free proposal template as promised!",
//         template: RESOURCE_NAMES.freeTemplate
//     },
//     fullUpworkStarterKit: {
//         fileName: RESOURCE_NAMES.fullUpworkStarterKit,
//         filePath: path.resolve(__dirname, '../public/fullUpworkStarterKit.pdf'),
//         subject: "The Complete Upwork Starter Kit â€“ Just for You!",
//         message: "Your Upwork Starter Kit is here! Follow the steps to kickstart your freelancing journey.",
//         template: RESOURCE_NAMES.fullUpworkStarterKit

//     },
//     profileOptimizationGuide: {
//         fileName: RESOURCE_NAMES.profileOptimizationGuide,
//         filePath: path.resolve(__dirname, '../public/profileOptimizationGuide.pdf'),
//         subject: "Your Profile Optimization Guide is Ready!",
//         message: "Hereâ€™s the complete guide to make your freelancing profile stand out!",
//         template: RESOURCE_NAMES.profileOptimizationGuide
//     },
//     theUltimateProposalCheatsheet: {
//         fileName: RESOURCE_NAMES.theUltimateProposalCheatsheet,
//         filePath: path.resolve(__dirname, '../public/theUltimateProposalCheatsheet.pdf'),
//         subject: "The Ultimate Proposal Cheat Sheet is Ready â€“ Download Now!",
//         message: "You now have access to top proposal-writing secrets to win more clients! Download Now",
//         template: RESOURCE_NAMES.theUltimateProposalCheatsheet
//     }
// };

// // Send email with a selected resource
// export const sendEmailWithResource = async (name, email, resourceType) => {
//     const resource = resourceMap[resourceType];

//     if (!resource) {
//         throw new AppError(400, "Invalid resource type selected");
//     }

//     const mailOptions = {
//         from: EMAIL_USERNAME,
//         to: email,
//         subject: `${name}, ${resource.subject}`,
//         template: resource.template,  // Refers to ".html files"
//         context: { name, message: resource.message },  // Dynamic content
//         attachments: [
//             {
//                 filename: resource.fileName + ".pdf",
//                 path: resource.filePath,
//             },
//         ],
//     };

//     try {
//         const info = await transporter.sendMail(mailOptions);
//         // console.log('âœ… Email sent:', info.response);
//         return info;
//     } catch (error) {
//         console.error('âŒ Error sending email:', error?.stack || error);
//         throw new AppError(500, `Failed to send email: ${error?.message}`);
//     }
// };

// // Send plain text or HTML email
// export const sendEmail = async (to, subject, text, html) => {

//     if (!to || !subject || (!text && !html)) {
//         throw new AppError(400, "Invalid email parameters: Missing content");
//     }

//     const mailOptions = {
//         from: EMAIL_USERNAME,
//         to,
//         subject,
//         text,
//         ...(html && { html }),
//     };

//     try {
//         const info = await transporter.sendMail(mailOptions);
//         // console.log('âœ… Email sent:', info.response);
//     } catch (error) {
//         throw new AppError(
//             500,
//             error?.response || error?.message || error.toString() || "Failed to send email"
//         );
//     }
// };
