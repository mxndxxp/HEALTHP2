// This is a mock email service for demonstration purposes.
// In a real application, you would integrate a service like SendGrid, Mailgun, or AWS SES.

export type UserDetails = {
    email: string;
    name: string;
    role: 'Patient' | 'Doctor' | 'Admin';
};

/**
 * Simulates sending a confirmation email to a user upon signup or login.
 * @param user - An object containing the user's email, name, and role.
 * @param eventType - The type of event, either 'signup' or 'login'.
 */
export const sendConfirmationEmail = async (user: UserDetails, eventType: 'signup' | 'login') => {
    const { email, name, role } = user;

    const subject = eventType === 'signup' 
        ? `Welcome to HealthSight, ${name}!`
        : `Successful Login to Your HealthSight Account`;

    const body = eventType === 'signup'
        ? `Hello ${name},\n\nThank you for creating your ${role} account with HealthSight.\n\nWe are excited to have you on board!\n\nBest regards,\nThe HealthSight Team`
        : `Hello ${name},\n\nThis is a confirmation that you have successfully logged into your HealthSight ${role} account.\n\nIf this was not you, please secure your account immediately.\n\nBest regards,\nThe HealthSight Team`;

    console.log('--- SIMULATING EMAIL ---');
    console.log(`To: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log('Body:\n', body);
    console.log('------------------------');

    // In a real implementation, the API call to your email service would be here.
    // For example:
    // await sendgrid.send({ to: email, from: 'no-reply@healthsight.com', subject, text: body });

    return Promise.resolve();
};
