import emailjs from "@emailjs/browser";

// Initialize EmailJS with public key
const initializeEmailJS = () => {
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  if (!publicKey) {
    console.error("EmailJS public key is missing from environment variables");
    return false;
  }
  emailjs.init(publicKey);
  return true;
};

/**
 * Send fire alert email via EmailJS
 * @param {Object} data - Alert data
 * @param {string} data.location - Location of fire detection
 * @param {number} data.confidence - Confidence percentage (0-100)
 * @param {string} data.timestamp - Time of detection
 * @param {string} data.image_name - Name/path of the image file
 * @returns {Promise<Object>} - Result with success status and message
 */
export const sendFireAlertEmail = async (data) => {
  try {
    // Initialize EmailJS if not already done
    initializeEmailJS();

    // Validate required environment variables
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

    if (!serviceId || !templateId) {
      console.error("EmailJS configuration is incomplete");
      return {
        success: false,
        message: "Email service configuration error",
        error: "Missing EmailJS credentials",
      };
    }

    const lat = data.latitude != null ? data.latitude : null;
    const lon = data.longitude != null ? data.longitude : null;
    const hasCoords = lat != null && lon != null;
    const locationIdentifier = data.location || data.image_name || "unknown_location";

    const templateParams = {
      latitude:  hasCoords ? String(lat) : "Not available",
      longitude: hasCoords ? String(lon) : "Not available",
      map_url:   (data.map_url && data.map_url !== "N/A") ? data.map_url : "Not available",
      // Required by template: filename-based location identifier
      location: locationIdentifier,
      confidence: data.confidence != null ? `${Math.round(data.confidence)}%` : "N/A",
      time:    data.timestamp || new Date().toLocaleString(),
      image:   data.image_name || "Unknown Image",
      message: "A possible forest fire has been detected. Please take immediate action.",
    };

    console.log("Sending fire alert email:", {
      location:   templateParams.location,
      latitude:   templateParams.latitude,
      longitude:  templateParams.longitude,
      map_url:    templateParams.map_url,
      confidence: templateParams.confidence,
      time:       templateParams.time,
      image:      templateParams.image,
    });

    // Send email via EmailJS
    const response = await emailjs.send(serviceId, templateId, templateParams);

    if (response.status === 200) {
      console.log("Fire alert email sent successfully", response);
      return {
        success: true,
        message: "Fire alert email sent successfully",
        messageId: response.text,
      };
    } else {
      console.error("EmailJS response status not 200:", response.status);
      return {
        success: false,
        message: "Failed to send fire alert email",
        error: `Status: ${response.status}`,
      };
    }
  } catch (error) {
    console.error("Error sending fire alert email:", error);
    return {
      success: false,
      message: "Failed to send fire alert email",
      error: error.message || "Unknown error occurred",
    };
  }
};

/**
 * Format alert data for email sending.
 * Uses backend response fields directly, including filename-based `location`.
 */
export const formatAlertData = (prediction) => {
   const lat = prediction.latitude != null ? prediction.latitude : null;
   const lon = prediction.longitude != null ? prediction.longitude : null;

   return {
     location:   prediction.location || prediction.image_name || "unknown_location",
     latitude:   lat,
     longitude:  lon,
     map_url:    prediction.map_url || null,
     confidence: Math.round(prediction.confidence * 100),
     timestamp:  new Date().toLocaleString(),
     image_name: prediction.image_name || "Uploaded Image",
   };
 };

/**
 * Check if fire alert should be sent based on prediction
 * @param {string} prediction - Prediction label ("Fire" or "NoFire")
 * @param {number} confidence - Confidence score (0-1)
 * @returns {boolean} - Whether to send alert
 */
export const shouldSendAlert = (prediction, confidence) => {
  return prediction === "Fire" && confidence > 0.85;
};

export default {
  sendFireAlertEmail,
  formatAlertData,
  shouldSendAlert,
  initializeEmailJS,
};
