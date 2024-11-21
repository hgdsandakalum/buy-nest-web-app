package com.example.buynest.models;
import android.os.Parcel;
import android.os.Parcelable;

public class Product implements Parcelable {
    private String id;
    private String name;
    private String description;
    private double price;
    private String category;
    private String vendorId;
    private String image;
    private boolean isActive;

    public Product(String id, String name, String description, double price, String category,  String vendorId, boolean isActive) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.vendorId = vendorId;
        this.isActive = isActive;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public double getPrice() {
        return price;
    }

    public String getCategory() {
        return category;
    }

//    public String getImage() {
//        return image;
//    }
//
//    public void setImage(String image) {
//        this.image = image;
//    }

    public String getVendorId() {
        return vendorId;
    }

    public boolean getIsActive() {
        return isActive;
    }

    public String getId() {
        return id;
    }

    protected Product(Parcel in) {
        id = in.readString();
        name = in.readString();
        description = in.readString();
        price = in.readDouble();
        category = in.readString();
        vendorId = in.readString();
        isActive = in.readByte() != 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(id);
        dest.writeString(name);
        dest.writeString(description);
        dest.writeDouble(price);
        dest.writeString(category);
        dest.writeString(vendorId);
        dest.writeByte((byte) (isActive ? 1 : 0));
    }

    @Override
    public int describeContents() {
        return 0;
    }

    public static final Parcelable.Creator<Product> CREATOR = new Parcelable.Creator<Product>() {
        @Override
        public Product createFromParcel(Parcel in) {
            return new Product(in);
        }

        @Override
        public Product[] newArray(int size) {
            return new Product[size];
        }
    };
}