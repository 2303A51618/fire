"""
Location utilities for extracting geographic coordinates from image filenames.

Supported filename format: <latitude>,<longitude>.<ext>
Example: -64.384,48.64359.jpg
"""
import os
import logging
import re
from typing import Optional, Tuple

logger = logging.getLogger(__name__)


def extract_coordinates_from_filename(
    filename: str,
) -> Tuple[Optional[float], Optional[float]]:
    """
    Parse latitude and longitude from a filename formatted as:
    ``<latitude>,<longitude>.<extension>``

    Args:
        filename: The image filename, e.g. ``-64.384,48.64359.jpg``

    Returns:
        A tuple ``(latitude, longitude)`` of floats, or ``(None, None)``
        if the filename does not match the expected format.

    Examples:
        >>> extract_coordinates_from_filename("-64.384,48.64359.jpg")
        (-64.384, 48.64359)
        >>> extract_coordinates_from_filename("unknown_image.jpg")
        (None, None)
    """
    if not filename:
        logger.debug("Empty filename provided to extract_coordinates_from_filename")
        return None, None

    try:
        # Strip directory path if present, work only with base name
        basename = os.path.basename(filename)

        # Remove the file extension
        name_without_ext, _ = os.path.splitext(basename)

        # Primary path: exact '<lat>,<lon>' format
        parts = name_without_ext.split(",")
        latitude: Optional[float] = None
        longitude: Optional[float] = None

        if len(parts) == 2:
            try:
                latitude = float(parts[0].strip())
                longitude = float(parts[1].strip())
            except ValueError:
                # Fall through to regex fallback for names like
                # 'fire_-64.384,48.64359' or '-64.384,48.64359 (1)'
                latitude = None
                longitude = None

        if latitude is None or longitude is None:
            # Fallback path: extract first two float-like values separated by comma
            match = re.search(r"(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)", name_without_ext)
            if not match:
                logger.debug(
                    f"Filename '{filename}' does not contain coordinate pair"
                )
                return None, None

            latitude = float(match.group(1))
            longitude = float(match.group(2))

        # Basic range validation
        if not (-90.0 <= latitude <= 90.0):
            logger.warning(
                f"Latitude {latitude} extracted from '{filename}' is out of valid range "
                "(-90 to 90); ignoring coordinates"
            )
            return None, None

        if not (-180.0 <= longitude <= 180.0):
            logger.warning(
                f"Longitude {longitude} extracted from '{filename}' is out of valid range "
                "(-180 to 180); ignoring coordinates"
            )
            return None, None

        logger.info(
            f"Extracted coordinates from filename '{filename}': "
            f"lat={latitude}, lon={longitude}"
        )
        return latitude, longitude

    except ValueError:
        logger.debug(
            f"Could not convert filename parts to float for '{filename}'; "
            "filename likely does not contain coordinates"
        )
        return None, None
    except Exception as e:
        logger.error(
            f"Unexpected error extracting coordinates from filename '{filename}': {e}"
        )
        return None, None


def generate_google_maps_url(
    latitude: Optional[float],
    longitude: Optional[float],
) -> Optional[str]:
    """
    Build a Google Maps URL for the given coordinates.

    Args:
        latitude: Latitude value.
        longitude: Longitude value.

    Returns:
        A Google Maps URL string, or ``None`` if either coordinate is missing.

    Examples:
        >>> generate_google_maps_url(-64.384, 48.64359)
        'https://maps.google.com/?q=-64.384,48.64359'
        >>> generate_google_maps_url(None, None)
        None
    """
    if latitude is None or longitude is None:
        return None

    url = f"https://maps.google.com/?q={latitude},{longitude}"
    logger.debug(f"Generated Google Maps URL: {url}")
    return url


def get_location_from_filename(
    filename: str,
) -> Tuple[Optional[float], Optional[float], Optional[str]]:
    """
    Convenience function that extracts coordinates and generates a Maps URL
    from an image filename in a single call.

    Args:
        filename: The image filename, e.g. ``-64.384,48.64359.jpg``

    Returns:
        A tuple ``(latitude, longitude, map_url)``.
        Each value is ``None`` when the filename does not contain valid coordinates.

    Examples:
        >>> get_location_from_filename("-64.384,48.64359.jpg")
        (-64.384, 48.64359, 'https://maps.google.com/?q=-64.384,48.64359')
        >>> get_location_from_filename("wildfire_scene.jpg")
        (None, None, None)
    """
    latitude, longitude = extract_coordinates_from_filename(filename)
    map_url = generate_google_maps_url(latitude, longitude)
    return latitude, longitude, map_url
