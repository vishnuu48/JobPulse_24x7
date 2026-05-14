import { Link } from 'react-router-dom';
import { FiMapPin } from 'react-icons/fi';
import { motion } from 'framer-motion';

const locationImages = {
  hyderabad: 'https://images.unsplash.com/photo-1626014303949-be5b7ccc5c52?w=400&h=300&fit=crop',
  bangalore: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&h=300&fit=crop',
  mumbai: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=300&fit=crop',
  delhi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop',
  pune: 'https://images.unsplash.com/photo-1604840455912-5e3f98586c93?w=400&h=300&fit=crop',
  chennai: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=300&fit=crop',
  kolkata: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=400&h=300&fit=crop',
  noida: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop',
  gurgaon: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop',
  ahmedabad: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=400&h=300&fit=crop'
};

const LocationCard = ({ name, slug, jobCount = 0, index = 0 }) => {
  const imageUrl = locationImages[slug.toLowerCase()] || locationImages.hyderabad;

  return (
    <motion.div
      className="location-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link
        to={`/location/${slug.toLowerCase()}`}
        className="block relative overflow-hidden rounded-xl group"
      >
        <div className="aspect-[4/3] relative">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center text-white mb-1">
              <FiMapPin className="w-4 h-4 mr-1" />
              <h3 className="font-semibold">{name}</h3>
            </div>
            <p className="text-white/80 text-sm">{jobCount}+ Jobs</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default LocationCard;
