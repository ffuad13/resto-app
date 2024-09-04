"use client"

import Image from "next/image";
import styles from "./page.module.css";
import {useEffect, useState} from 'react';
import React from "react";
import {useRouter, useSearchParams} from 'next/navigation';

/* export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Get started by editing&nbsp;
          <code className={styles.code}>src/app/page.tsx</code>
        </p>
        <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className={styles.vercelLogo}
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className={styles.grid}>
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Docs <span>-&gt;</span>
          </h2>
          <p>Find in-depth information about Next.js features and API.</p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Learn <span>-&gt;</span>
          </h2>
          <p>Learn about Next.js in an interactive course with&nbsp;quizzes!</p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Templates <span>-&gt;</span>
          </h2>
          <p>Explore starter templates for Next.js.</p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Deploy <span>-&gt;</span>
          </h2>
          <p>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  );
} */

async function deleteMenu(id: string) {
  const res = await fetch(`http://127.0.0.1:8000/api/menu/${id}/`, {
    method: "DELETE"
  })
  if (!res.ok) throw new Error("Failed to retrieve menu")
  return Promise.resolve()
}

async function getData() {
  const res = await fetch("http://127.0.0.1:8000/api/menu/")
  if (!res.ok) throw new Error("Failed to fetch data")
  return res.json()
}

interface MenuItemProps {
  id: string
  name: string
  price: number
  onEdit: () => void
  onDelete: (id: string) => void
}

const MenuItem: React.FC<MenuItemProps> = ({id, name, price, onEdit, onDelete}) => {
  return (
    <div className="menu-item" data-id={id}>
      <div className="menu-item-info">
        <div className="menu-item-name">{name}</div>
        <div className="menu-item-price">${price.toFixed(2)}</div>
      </div>
      <div className="menu-item-actions">
        <button className="edit-button" onClick={onEdit}>
          Edit
        </button>
        <button className="delete-button" onClick={() => {
          deleteMenu(id).then(() => onDelete(id))
        }}>
          Delete
        </button>
      </div>
    </div>
  )
}

interface MenuItemType {
  id: string;
  name: string;
  price: number;
}

interface SuccessMessageState {
  show: boolean;
  type: "add" | "update" | "";
}

export default function Page() {
  const [menuItems, setMenuItems] = useState<MenuItemType[] | null>(null);
  const router = useRouter();
  const params = useSearchParams();

  const [displaySuccessMessage, setDisplaySuccessMessage] = useState<SuccessMessageState>({
    show: false,
    type: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData();
        setMenuItems(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const action = params.get('action');
    if (action) {
      setDisplaySuccessMessage({
        type: action as 'add' | 'update',
        show: true,
      });
      router.replace('/');
    }
  }, [params, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (displaySuccessMessage.show) {
        setDisplaySuccessMessage({ show: false, type: '' });
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [displaySuccessMessage.show]);

  const handleDelete = (id: string) => {
    setMenuItems((items) => items?.filter((item) => item.id !== id) || null);
  };

  return (
    <div>
      <button className="add-button" onClick={() => router.push('/add')}>
        Add
      </button>
      {displaySuccessMessage.show && (
        <p className="success-message">
          {displaySuccessMessage.type === 'add' ? 'Added a' : 'Modified a'} menu item.
        </p>
      )}
      {menuItems ? (
        menuItems.map((item) => (
          <MenuItem
            key={item.id}
            id={item.id}
            name={item.name}
            price={item.price}
            onEdit={() => router.push(`/update/${item.id}`)}
            onDelete={handleDelete}
          />
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}