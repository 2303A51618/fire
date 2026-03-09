"""
Utility functions for extracting EXIF metadata from images, including GPS coordinates
"""
import logging
from typing import Optional, Tuple
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS

logger = logging.getLogger(__name__)


def _convert_to_degrees(value: tuple) -> float:
    """
    Convert GPS coordinates from degrees/minutes/seconds to decimal degrees
    
    Args:
        value: Tuple of (degrees, minutes, seconds) as Rational numbers
    
    Returns:
        Decimal degrees as float
    """
    try:
        d = float(value[0])
        m = float(value[1])
        s = float(value[2])
        return d + (m / 60.0) + (s / 3600.0)
    except (IndexError, TypeError, ValueError) as e:
        logger.error(f"Error converting GPS coordinates: {str(e)}")
        return 0.0


def extract_gps_coordinates(image: Image.Image) -> Tuple[Optional[float], Optional[float]]:
    """
    Extract GPS coordinates (latitude, longitude) from image EXIF data
    
    Args:
        image: PIL Image object
    
    Returns:
        Tuple of (latitude, longitude) as floats, or (None, None) if not available
    """
    try:
        # Get EXIF data
        exif_data = image._getexif()
        
        if not exif_data:
            logger.debug("No EXIF data found in image")
            return None, None
        
        # Find GPS Info tag
        gps_info = None
        for tag, value in exif_data.items():
            tag_name = TAGS.get(tag, tag)
            if tag_name == 'GPSInfo':
                gps_info = value
                break
        
        if not gps_info:
            logger.debug("No GPS info found in EXIF data")
            return None, None
        
        # Extract GPS data
        gps_data = {}
        for tag in gps_info.keys():
            tag_name = GPSTAGS.get(tag, tag)
            gps_data[tag_name] = gps_info[tag]
        
        # Get latitude
        latitude = None
        if 'GPSLatitude' in gps_data and 'GPSLatitudeRef' in gps_data:
            lat = _convert_to_degrees(gps_data['GPSLatitude'])
            if gps_data['GPSLatitudeRef'] == 'S':
                lat = -lat
            latitude = lat
        
        # Get longitude
        longitude = None
        if 'GPSLongitude' in gps_data and 'GPSLongitudeRef' in gps_data:
            lon = _convert_to_degrees(gps_data['GPSLongitude'])
            if gps_data['GPSLongitudeRef'] == 'W':
                lon = -lon
            longitude = lon
        
        if latitude is not None and longitude is not None:
            logger.info(f"Extracted GPS coordinates from image: ({latitude:.6f}, {longitude:.6f})")
            return latitude, longitude
        else:
            logger.debug("GPS coordinates incomplete in EXIF data")
            return None, None
            
    except AttributeError:
        logger.debug("Image does not support EXIF data extraction")
        return None, None
    except Exception as e:
        logger.warning(f"Error extracting GPS from EXIF: {str(e)}")
        return None, None


def extract_image_metadata(image: Image.Image) -> dict:
    """
    Extract comprehensive metadata from image EXIF data
    
    Args:
        image: PIL Image object
    
    Returns:
        Dictionary containing metadata (camera model, date, etc.)
    """
    metadata = {
        'has_gps': False,
        'camera_make': None,
        'camera_model': None,
        'datetime_original': None,
        'latitude': None,
        'longitude': None,
    }
    
    try:
        exif_data = image._getexif()
        
        if not exif_data:
            return metadata
        
        # Extract common EXIF tags
        for tag, value in exif_data.items():
            tag_name = TAGS.get(tag, tag)
            
            if tag_name == 'Make':
                metadata['camera_make'] = str(value)
            elif tag_name == 'Model':
                metadata['camera_model'] = str(value)
            elif tag_name == 'DateTimeOriginal':
                metadata['datetime_original'] = str(value)
            elif tag_name == 'GPSInfo':
                metadata['has_gps'] = True
        
        # Extract GPS coordinates
        lat, lon = extract_gps_coordinates(image)
        if lat is not None and lon is not None:
            metadata['latitude'] = lat
            metadata['longitude'] = lon
            metadata['has_gps'] = True
        
        return metadata
        
    except Exception as e:
        logger.warning(f"Error extracting image metadata: {str(e)}")
        return metadata
