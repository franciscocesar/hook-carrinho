import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
     
   
    const storagedCart = localStorage.getItem('@RocketShoes:cart')

      if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const newProduct = [...cart];

      const findProduct = newProduct.find( e => e.id === productId)

      const stock = await api.get(`./stock/${productId}`)
      
      const stockAmount = stock.data.amount;
      const trueProduct = findProduct ? findProduct.amount : 0
      const amountProduct = trueProduct + 1

      if(amountProduct > stockAmount){
        toast.error('Quantidade solicitada fora de estoque')
        return
      }

      if(findProduct){
        findProduct.amount = amountProduct;
      } else {
        const product = await api.get(`/product/${productId}`)
        const dataProduct ={
          ...product.data,
          amount:1
        }

        newProduct.push(dataProduct)
      }
      setCart(newProduct)
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(newProduct))

    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
