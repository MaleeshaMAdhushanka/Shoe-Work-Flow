"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, Package, DollarSign, Ruler, ListOrdered, Activity } from "lucide-react";
import { Item, ItemState } from "@/app/lib/types";

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "view" | "edit" | "add";
  errorState: ItemState;
  initialData?: Item;
  onSubmit: (data: FormData) => void;
}

export function ItemModal({ isOpen, onClose, mode, errorState, initialData, onSubmit }: ItemModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const [imageRemoved, setImageRemoved] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setImageRemoved(false);
    setSelectedImage(null);

    const dialog = dialogRef.current;
    if (dialog) {
      dialog.showModal();
      return () => {
        dialog.close();
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && formRef.current) {
      formRef.current.reset();
    }
  }, [isOpen]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);

    if (imageRemoved) {
      formData.append("removeImage", initialData?.image || "");
    }

    if (selectedImage) {
      formData.set("image", selectedImage);
    }

    onSubmit(formData);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current?.classList.add("border-blue-500");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current?.classList.remove("border-blue-500");
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current?.classList.remove("border-blue-500");
//chek validation,file type
    const file = e.dataTransfer?.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setImageRemoved(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setImageRemoved(false);
    } else {
      e.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setImageRemoved(true);
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getModalTitle = () => {
    switch (mode) {
      case "view":
        return "Item Details";
      case "edit":
        return "Edit Item";
      case "add":
        return "Add New Item";
    }
  };
//show preview image before upload
  const renderImage = () => {
    if (selectedImage) {
      return (
        <div className="relative">
          <Image src={URL.createObjectURL(selectedImage)} alt="Selected product" width={64} height={64} className="mx-auto h-16 w-16 object-cover rounded" />
          <button type="button" onClick={handleRemoveImage} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2">
            <X className="h-4 w-4" />
          </button>
        </div>
      );
    }

    if (initialData?.image && !imageRemoved) {
      return (
        <div className="relative">
          <Image src={`${process.env.NEXT_PUBLIC_BLOB_URL}${initialData.image}`} alt="Product" width={128} height={128} className="mx-auto object-cover rounded" />
          <button type="button" onClick={handleRemoveImage} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2">
            <X className="h-4 w-4" />
          </button>
        </div>
      );
    }

    return (
      <div>
        <input ref={fileInputRef} type="file" name="image" accept="image/*" onChange={handleFileSelect} className="hidden" id="file-upload" />
        <label htmlFor="file-upload" className="cursor-pointer text-blue-600 hover:text-blue-500">
          Drop an image here or click to upload
        </label>
      </div>
    );
  };

  return (
    <dialog ref={dialogRef} className="bg-white rounded-lg shadow-xl w-full max-w-2xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop:bg-gray-800/70">
      <div className="bg-white rounded-lg">
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <h3 className="text-lg font-semibold text-gray-900">{getModalTitle()}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} method="dialog">
          <div className="p-4 space-y-4">
            <div className="flex gap-10">
              <div className="space-y-4 flex-1">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      name="name"
                      type="text"
                      defaultValue={initialData?.name}
                      placeholder="Enter product name"
                      className={`pl-10 w-full border border-gray-300 rounded-lg py-2 px-3 outline-none ${
                        errorState?.errors?.name ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      }  `}
                      readOnly={mode === "view"}
                      
                    />
                  </div>
                  {errorState?.errors?.name && <p className="mt-1 text-sm text-red-600">{errorState.errors.name[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                  {mode !== "view" ? (
                    <div
                      ref={dropZoneRef}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors"
                    >
                      {renderImage()}
                    </div>
                  ) : (
                    initialData?.image && <Image src={`${process.env.NEXT_PUBLIC_BLOB_URL}${initialData.image}`} alt="Product" width={128} height={128} className="object-cover rounded" />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={initialData?.price}
                      placeholder="Enter price"
                      className={`pl-10 w-full border border-gray-300 rounded-lg py-2 px-3 outline-none ${
                        errorState?.errors?.price ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      }   `}
                      readOnly={mode === "view"}
                      required
                    />
                  </div>
                  {errorState?.errors?.price && <p className="mt-1 text-sm text-red-600">{errorState.errors.price[0]}</p>}
                </div>
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      name="size"
                      type="text"
                      defaultValue={initialData?.size}
                      placeholder="Enter size"
                      className={`pl-10 w-full border border-gray-300 rounded-lg py-2 px-3 outline-none ${
                        errorState?.errors?.size ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      }  `}
                      readOnly={mode === "view"}
                      required
                    />
                  </div>
                  {errorState?.errors?.size && <p className="mt-1 text-sm text-red-600">{errorState.errors.size[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <div className="relative">
                    <ListOrdered className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      name="qty"
                      type="number"
                      min="0"
                      defaultValue={initialData?.qty}
                      placeholder="Enter quantity"
                      className={`pl-10 w-full border border-gray-300 rounded-lg py-2 px-3 outline-none ${
                        errorState?.errors?.qty ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      }  `}
                      readOnly={mode === "view"}
                      required
                    />
                  </div>
                  {errorState?.errors?.qty && <p className="mt-1 text-sm text-red-600">{errorState.errors.qty[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <div className="relative">
                    <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      name="status"
                      className={`pl-10 w-full border border-gray-300 rounded-lg py-2 px-3 outline-none ${
                        errorState?.errors?.status ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      }  `}
                      defaultValue={initialData?.status}
                      disabled={mode === "view"}
                      required
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  {errorState?.errors?.status && <p className="mt-1 text-sm text-red-600">{errorState.errors.status[0]}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-300">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
              Cancel
            </button>
            {mode !== "view" && (
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
                {mode === "edit" ? "Save Changes" : "Add Item"}
              </button>
            )}
          </div>
        </form>
      </div>
    </dialog>
  );
}
