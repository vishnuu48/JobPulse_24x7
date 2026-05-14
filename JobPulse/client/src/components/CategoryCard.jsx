import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CategoryCard = ({ category, index = 0 }) => {
  return (
    <motion.div
      className="category-card"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link
        to={`/category/${category.slug}`}
        className="block surface-card surface-card-hover p-6 group"
      >
        <div 
          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform group-hover:scale-110"
          style={{ backgroundColor: `${category.color}15` }}
        >
          {category.icon}
        </div>
        <h3 className="font-semibold text-textDark group-hover:text-primary transition-colors">
          {category.name}
        </h3>
        <p className="text-sm text-muted mt-1">
          {category.jobCount || 0} Jobs Available
        </p>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
