package com.troyecto.marketplace.config;

import com.troyecto.marketplace.entities.*;
import com.troyecto.marketplace.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StoreRepository storeRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ReviewRepository reviewRepository;

    @Override
    public void run(String... args) throws Exception {
        // Solo ejecutar si no hay datos
        if (userRepository.count() > 0) {
            System.out.println("✅ Database already seeded, skipping...");
            return;
        }

        System.out.println("🌱 Seeding database...");

        // 1. Crear Usuarios
        List<User> users = createUsers();
        System.out.println("✅ Created " + users.size() + " users");

        // 2. Crear Tiendas
        List<Store> stores = createStores(users);
        System.out.println("✅ Created " + stores.size() + " stores");

        // 3. Crear Productos
        List<Product> products = createProducts(stores);
        System.out.println("✅ Created " + products.size() + " products");

        // 4. Crear Órdenes
        List<Order> orders = createOrders(users);
        System.out.println("✅ Created " + orders.size() + " orders");

        // 5. Crear OrderItems
        List<OrderItem> orderItems = createOrderItems(orders, products);
        System.out.println("✅ Created " + orderItems.size() + " order items");

        // 6. Crear Reviews
        List<Review> reviews = createReviews(users, products);
        System.out.println("✅ Created " + reviews.size() + " reviews");

        System.out.println("🎉 Database seeding completed successfully!");
    }

    private List<User> createUsers() {
        List<User> users = new ArrayList<>();

        User user1 = User.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .phone("555-0101")
                .address("123 Main St, New York, NY 10001")
                .role("ROLE_USER")
                .build();

        User user2 = User.builder()
                .firstName("Jane")
                .lastName("Smith")
                .email("jane.smith@example.com")
                .phone("555-0102")
                .address("456 Oak Ave, Los Angeles, CA 90001")
                .role("ROLE_USER")
                .build();

        User user3 = User.builder()
                .firstName("Michael")
                .lastName("Johnson")
                .email("michael.j@example.com")
                .phone("555-0103")
                .address("789 Pine Rd, Chicago, IL 60601")
                .role("ROLE_ADMIN")
                .build();

        User user4 = User.builder()
                .firstName("Emily")
                .lastName("Williams")
                .email("emily.w@example.com")
                .phone("555-0104")
                .address("321 Elm St, Houston, TX 77001")
                .role("ROLE_USER")
                .build();

        User user5 = User.builder()
                .firstName("David")
                .lastName("Brown")
                .email("david.b@example.com")
                .phone("555-0105")
                .address("654 Maple Dr, Phoenix, AZ 85001")
                .role("ROLE_USER")
                .build();

        users.add(user1);
        users.add(user2);
        users.add(user3);
        users.add(user4);
        users.add(user5);

        return userRepository.saveAll(users);
    }

    private List<Store> createStores(List<User> users) {
        List<Store> stores = new ArrayList<>();

        Store store1 = Store.builder()
                .name("Tech Paradise")
                .description("Your one-stop shop for all things tech")
                .category("Electronics")
                .isActive(true)
                .user(users.get(0))
                .createdDate(LocalDateTime.now().minusDays(30))
                .build();

        Store store2 = Store.builder()
                .name("Fashion Hub")
                .description("Latest trends in fashion and accessories")
                .category("Clothing")
                .isActive(true)
                .user(users.get(1))
                .createdDate(LocalDateTime.now().minusDays(25))
                .build();

        Store store3 = Store.builder()
                .name("Book Haven")
                .description("Books for every reader")
                .category("Books")
                .isActive(true)
                .user(users.get(2))
                .createdDate(LocalDateTime.now().minusDays(20))
                .build();

        Store store4 = Store.builder()
                .name("Home Essentials")
                .description("Everything you need for your home")
                .category("Furniture")
                .isActive(true)
                .user(users.get(3))
                .createdDate(LocalDateTime.now().minusDays(15))
                .build();

        stores.add(store1);
        stores.add(store2);
        stores.add(store3);
        stores.add(store4);

        return storeRepository.saveAll(stores);
    }

    private List<Product> createProducts(List<Store> stores) {
        List<Product> products = new ArrayList<>();

        // Tech Paradise Products
        products.add(Product.builder()
                .name("iPhone 15 Pro")
                .description("Latest Apple smartphone with A17 chip")
                .price(new BigDecimal("999.99"))
                .stock(50)
                .store(stores.get(0))
                .isAvailable(true)
                .publishedDate(LocalDateTime.now().minusDays(10))
                .build());

        products.add(Product.builder()
                .name("Samsung Galaxy S24")
                .description("Flagship Android phone with AI features")
                .price(new BigDecimal("899.99"))
                .stock(35)
                .store(stores.get(0))
                .isAvailable(true)
                .publishedDate(LocalDateTime.now().minusDays(8))
                .build());

        products.add(Product.builder()
                .name("MacBook Pro M3")
                .description("Powerful laptop for professionals")
                .price(new BigDecimal("1999.99"))
                .stock(20)
                .store(stores.get(0))
                .isAvailable(true)
                .publishedDate(LocalDateTime.now().minusDays(5))
                .build());

        // Fashion Hub Products
        products.add(Product.builder()
                .name("Designer Leather Jacket")
                .description("Premium quality leather jacket")
                .price(new BigDecimal("299.99"))
                .stock(15)
                .store(stores.get(1))
                .isAvailable(true)
                .publishedDate(LocalDateTime.now().minusDays(12))
                .build());

        products.add(Product.builder()
                .name("Casual Denim Jeans")
                .description("Comfortable everyday jeans")
                .price(new BigDecimal("79.99"))
                .stock(100)
                .store(stores.get(1))
                .isAvailable(true)
                .publishedDate(LocalDateTime.now().minusDays(9))
                .build());

        products.add(Product.builder()
                .name("Summer Dress Collection")
                .description("Elegant summer dresses")
                .price(new BigDecimal("149.99"))
                .stock(45)
                .store(stores.get(1))
                .isAvailable(true)
                .publishedDate(LocalDateTime.now().minusDays(7))
                .build());

        // Book Haven Products
        products.add(Product.builder()
                .name("The Great Novel")
                .description("Award-winning contemporary fiction")
                .price(new BigDecimal("24.99"))
                .stock(80)
                .store(stores.get(2))
                .isAvailable(true)
                .publishedDate(LocalDateTime.now().minusDays(15))
                .build());

        products.add(Product.builder()
                .name("Programming Guide 2024")
                .description("Complete guide to modern programming")
                .price(new BigDecimal("49.99"))
                .stock(60)
                .store(stores.get(2))
                .isAvailable(true)
                .publishedDate(LocalDateTime.now().minusDays(6))
                .build());

        // Home Essentials Products
        products.add(Product.builder()
                .name("Modern Coffee Table")
                .description("Stylish coffee table for living room")
                .price(new BigDecimal("399.99"))
                .stock(25)
                .store(stores.get(3))
                .isAvailable(true)
                .publishedDate(LocalDateTime.now().minusDays(11))
                .build());

        products.add(Product.builder()
                .name("Ergonomic Office Chair")
                .description("Comfortable chair for long work hours")
                .price(new BigDecimal("299.99"))
                .stock(30)
                .store(stores.get(3))
                .isAvailable(true)
                .publishedDate(LocalDateTime.now().minusDays(4))
                .build());

        return productRepository.saveAll(products);
    }

    private List<Order> createOrders(List<User> users) {
        List<Order> orders = new ArrayList<>();

        orders.add(Order.builder()
                .subtotal(999.99)
                .totalAmount(1080)
                .tax(80.00)
                .currency("USD")
                .payMethod("Visa")
                .paymentStatus("Complete")
                .orderDate(LocalDateTime.now().minusDays(3))
                .user(users.get(0))
                .build());

        orders.add(Order.builder()
                .subtotal(449.98)
                .totalAmount(486)
                .tax(36.00)
                .currency("USD")
                .payMethod("MasterCard")
                .paymentStatus("Complete")
                .orderDate(LocalDateTime.now().minusDays(2))
                .user(users.get(1))
                .build());

        orders.add(Order.builder()
                .subtotal(299.99)
                .totalAmount(324)
                .tax(24.00)
                .currency("USD")
                .payMethod("Paypal")
                .paymentStatus("Pending")
                .orderDate(LocalDateTime.now().minusDays(1))
                .user(users.get(3))
                .build());

        orders.add(Order.builder()
                .subtotal(149.99)
                .totalAmount(162)
                .tax(12.00)
                .currency("USD")
                .payMethod("Visa")
                .paymentStatus("Complete")
                .orderDate(LocalDateTime.now().minusHours(12))
                .user(users.get(4))
                .build());

        return orderRepository.saveAll(orders);
    }

    private List<OrderItem> createOrderItems(List<Order> orders, List<Product> products) {
        List<OrderItem> orderItems = new ArrayList<>();

        // Order 1: iPhone
        orderItems.add(OrderItem.builder()
                .quantity(1)
                .price(999.99)
                .subtotal(999.99)
                .order(orders.get(0))
                .product(products.get(0))
                .build());

        // Order 2: Leather Jacket + Jeans
        orderItems.add(OrderItem.builder()
                .quantity(1)
                .price(299.99)
                .subtotal(299.99)
                .order(orders.get(1))
                .product(products.get(3))
                .build());

        orderItems.add(OrderItem.builder()
                .quantity(2)
                .price(79.99)
                .subtotal(159.98)
                .order(orders.get(1))
                .product(products.get(4))
                .build());

        // Order 3: Office Chair
        orderItems.add(OrderItem.builder()
                .quantity(1)
                .price(299.99)
                .subtotal(299.99)
                .order(orders.get(2))
                .product(products.get(9))
                .build());

        // Order 4: Summer Dress
        orderItems.add(OrderItem.builder()
                .quantity(1)
                .price(149.99)
                .subtotal(149.99)
                .order(orders.get(3))
                .product(products.get(5))
                .build());

        return orderItemRepository.saveAll(orderItems);
    }

    private List<Review> createReviews(List<User> users, List<Product> products) {
        List<Review> reviews = new ArrayList<>();

        reviews.add(Review.builder()
                .rating(5)
                .comment("Excellent product! Highly recommended.")
                .user(users.get(0))
                .product(products.get(0))
                .createdAt(LocalDateTime.now().minusDays(2))
                .updatedAt(LocalDateTime.now().minusDays(2))
                .build());

        reviews.add(Review.builder()
                .rating(4)
                .comment("Good quality, fast shipping.")
                .user(users.get(1))
                .product(products.get(1))
                .createdAt(LocalDateTime.now().minusDays(3))
                .updatedAt(LocalDateTime.now().minusDays(3))
                .build());

        reviews.add(Review.builder()
                .rating(5)
                .comment("Perfect! Exactly what I needed.")
                .user(users.get(2))
                .product(products.get(3))
                .createdAt(LocalDateTime.now().minusDays(1))
                .updatedAt(LocalDateTime.now().minusDays(1))
                .build());

        reviews.add(Review.builder()
                .rating(3)
                .comment("Good but a bit pricey.")
                .user(users.get(3))
                .product(products.get(5))
                .createdAt(LocalDateTime.now().minusHours(18))
                .updatedAt(LocalDateTime.now().minusHours(18))
                .build());

        reviews.add(Review.builder()
                .rating(5)
                .comment("Amazing quality and comfort!")
                .user(users.get(4))
                .product(products.get(9))
                .createdAt(LocalDateTime.now().minusHours(6))
                .updatedAt(LocalDateTime.now().minusHours(6))
                .build());

        reviews.add(Review.builder()
                .rating(4)
                .comment("Very good book, enjoyed reading it.")
                .user(users.get(0))
                .product(products.get(6))
                .createdAt(LocalDateTime.now().minusDays(4))
                .updatedAt(LocalDateTime.now().minusDays(4))
                .build());

        return reviewRepository.saveAll(reviews);
    }
}
