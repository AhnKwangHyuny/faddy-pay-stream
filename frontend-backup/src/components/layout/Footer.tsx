import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              SHOP
            </h3>
            <p className="mt-4 text-sm text-gray-600">
              최고의 상품을 합리적인 가격으로 제공합니다.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              고객 서비스
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:text-gray-900">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:text-gray-900">
                  배송 정책
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:text-gray-900">
                  환불 정책
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              연락처
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-gray-600">
                이메일: contact@example.com
              </li>
              <li className="text-sm text-gray-600">
                전화: 1234-5678
              </li>
              <li className="text-sm text-gray-600">
                주소: 서울특별시 강남구 테헤란로 123
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-600 text-center">
            &copy; {new Date().getFullYear()} SHOP. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;